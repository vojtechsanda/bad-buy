import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.105.1';

import type { Database } from '../../../src/shared/types/database.ts';
import { GEMINI_API_KEY, SUPABASE_ANON_KEY, SUPABASE_URL } from '../_shared/env.ts';
import {
  fetchAccount,
  fetchCachedSuggestions,
  fetchHobbies,
  fetchRateLimitCounts,
  incrementRateLimit,
  replaceSuggestions,
} from './db.ts';
import type { Supabase } from './db.ts';
import { callGemini } from './gemini.ts';
import {
  findExceededFreeWindow,
  getWindowKeys,
  isOverPremiumCap,
  secondsUntilNextWindow,
} from './rate-limit.ts';
import { RequestBodySchema } from './schemas.ts';
import { toSuggestionRows } from './transforms.ts';
import type { AccountHobbyRef, AccountSuggestion, StepResult } from './types.ts';
import { stepFail, stepOk } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(
  data: unknown,
  status = 200,
  extraHeaders?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', ...extraHeaders },
  });
}

// ---------------------------------------------------------------------------
// Pipeline steps
// ---------------------------------------------------------------------------

async function resolveAuth(
  req: Request,
): Promise<StepResult<{ supabase: Supabase; userId: string }>> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return stepFail(jsonResponse({ error: 'Missing authorization' }, 401));
  }

  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return stepFail(jsonResponse({ error: 'Unauthorized' }, 401));
  }

  return stepOk({ supabase, userId: user.id });
}

async function parseBody(
  req: Request,
): Promise<StepResult<{ priceUsd?: number; forceRefresh: boolean }>> {
  let rawBody: unknown = {};
  if (req.headers.get('content-type')?.includes('application/json')) {
    try {
      rawBody = await req.json();
    } catch {
      return stepFail(jsonResponse({ error: 'Invalid JSON in request body' }, 400));
    }
  }

  const result = RequestBodySchema.safeParse(rawBody);
  if (!result.success) {
    return stepFail(
      jsonResponse({ error: 'Invalid request body', detail: result.error.flatten() }, 400),
    );
  }

  const { price_usd: priceUsd, force_refresh: forceRefresh = false } = result.data;
  return stepOk({ priceUsd, forceRefresh });
}

type RequestContext = {
  isPremium: boolean;
  country: string;
  hobbies: AccountHobbyRef[];
  hobbyIds: string[];
};

async function loadContext(
  supabase: Supabase,
  userId: string,
  forceRefresh: boolean,
): Promise<StepResult<RequestContext>> {
  // fetchAccount failure → user not found (expected 4xx), short-circuit with ok:false.
  let account;
  try {
    account = await fetchAccount(supabase, userId);
  } catch {
    return stepFail(jsonResponse({ error: 'Account not found' }, 404));
  }

  const isPremium =
    account.premium_expires_at != null && new Date(account.premium_expires_at) > new Date();
  const country = account.country || 'Unknown';

  // Reject free users requesting a forced refresh before paying the hobbies query cost.
  if (forceRefresh && !isPremium) {
    return stepFail(jsonResponse({ error: 'force_refresh requires a premium account' }, 403));
  }

  // fetchHobbies failure is an unexpected DB error (not a known 4xx), so we throw
  // and let the top-level catch convert it to a 500 rather than returning ok:false.
  let hobbies;
  try {
    hobbies = await fetchHobbies(supabase, userId);
  } catch (e) {
    console.error('[generate-suggestions] fetchHobbies error', e);
    throw new Error('Database error fetching hobbies');
  }

  if (!hobbies.length) {
    return stepFail(jsonResponse({ suggestions: [] }));
  }

  return stepOk({ isPremium, country, hobbies, hobbyIds: hobbies.map((h) => h.id) });
}

type RateLimitResult =
  | { outcome: 'allowed'; allWindowKeys: string[] }
  | { outcome: 'over_cap' }
  | { outcome: 'blocked'; retryAfter: number };

/**
 * Determine whether the request may proceed to the Gemini call.
 * Does NOT fetch or serve cached suggestions — that belongs to the caller.
 *
 * Note: the read-then-increment is not atomic; under burst traffic a window
 * may be slightly over-counted. Acceptable at current traffic levels.
 */
async function checkRateLimit(
  supabase: Supabase,
  isPremium: boolean,
  now: Date,
): Promise<RateLimitResult> {
  const windows = getWindowKeys(now);
  const allWindowKeys = [windows.min, windows.hour, windows.day, windows.month];

  let currentCounts;
  try {
    currentCounts = await fetchRateLimitCounts(supabase, allWindowKeys);
  } catch (e) {
    console.error('[generate-suggestions] fetchRateLimitCounts error', e);
    throw new Error('Database error reading rate limit');
  }

  if (isPremium && isOverPremiumCap(currentCounts, windows)) {
    return { outcome: 'over_cap' };
  }

  if (!isPremium) {
    const exceeded = findExceededFreeWindow(currentCounts, windows);
    if (exceeded) {
      return { outcome: 'blocked', retryAfter: secondsUntilNextWindow(now, exceeded) };
    }
  }

  return { outcome: 'allowed', allWindowKeys };
}

async function generateAndPersist(
  supabase: Supabase,
  hobbies: AccountHobbyRef[],
  hobbyIds: string[],
  country: string,
  priceUsd: number | undefined,
  allWindowKeys: string[],
): Promise<AccountSuggestion[]> {
  const hobbyNames = hobbies.map((h) => h.hobby_name);

  const aiSuggestions = await callGemini(GEMINI_API_KEY, country, hobbyNames, priceUsd);
  const rows = toSuggestionRows(aiSuggestions, hobbies, country);

  let inserted;
  try {
    inserted = await replaceSuggestions(supabase, hobbyIds, country, rows);
  } catch (e) {
    console.error('[generate-suggestions] replaceSuggestions error', e);
    throw new Error('Database error persisting suggestions');
  }

  // Non-fatal: a persistent failure here silently disables rate limiting.
  // TODO: pipe to an alerting channel (e.g. Sentry) so silent failures are visible.
  try {
    await incrementRateLimit(supabase, allWindowKeys);
  } catch (e) {
    console.warn('[generate-suggestions] rate-limit increment failed (non-fatal)', e);
  }

  return inserted;
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

async function handleRequest(req: Request): Promise<Response> {
  const authResult = await resolveAuth(req);
  if (!authResult.ok) return authResult.response;
  const { supabase, userId } = authResult.value;

  const bodyResult = await parseBody(req);
  if (!bodyResult.ok) return bodyResult.response;
  const { priceUsd, forceRefresh } = bodyResult.value;

  const contextResult = await loadContext(supabase, userId, forceRefresh);
  if (!contextResult.ok) return contextResult.response;
  const { isPremium, country, hobbies, hobbyIds } = contextResult.value;

  if (!forceRefresh) {
    const cached = await fetchCachedSuggestions(supabase, hobbyIds, country);
    if (cached.length) return jsonResponse({ suggestions: cached });
  }

  const rateLimit = await checkRateLimit(supabase, isPremium, new Date());

  if (rateLimit.outcome === 'over_cap') {
    const cached = await fetchCachedSuggestions(supabase, hobbyIds, country);
    return jsonResponse({ suggestions: cached });
  }

  if (rateLimit.outcome === 'blocked') {
    return jsonResponse({ error: 'Rate limit exceeded' }, 429, {
      'Retry-After': String(rateLimit.retryAfter),
    });
  }

  const suggestions = await generateAndPersist(
    supabase,
    hobbies,
    hobbyIds,
    country,
    priceUsd,
    rateLimit.allWindowKeys,
  );
  return jsonResponse({ suggestions });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    return await handleRequest(req);
  } catch (err) {
    console.error('[generate-suggestions]', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});
