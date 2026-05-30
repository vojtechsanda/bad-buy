import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.105.1';
import { z } from 'https://esm.sh/zod@3';

import type { Database } from '../../../src/shared/types/database.ts';
import {
  fetchAccount,
  fetchCachedSuggestions,
  fetchHobbies,
  fetchRateLimitCounts,
  incrementRateLimit,
  replaceSuggestions,
} from './db.ts';
import { callGemini } from './gemini.ts';
import {
  findExceededFreeWindow,
  getWindowKeys,
  isOverPremiumCap,
  secondsUntilNextWindow,
} from './rate-limit.ts';
import { toSuggestionRows } from './transforms.ts';

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const GEMINI_API_KEY = requireEnv('GEMINI_API_KEY');
const SUPABASE_URL = requireEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY = requireEnv('SUPABASE_ANON_KEY');

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

const RequestBodySchema = z.object({
  /** USD amount the user is about to spend — used to steer suggestion price range. */
  price_usd: z.number().positive().optional(),
  /** When true, skip the cache and always call the AI provider. Premium-only action on the client. */
  force_refresh: z.boolean().optional(),
});

async function handleRequest(req: Request): Promise<Response> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return jsonResponse({ error: 'Missing authorization' }, 401);

  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return jsonResponse({ error: 'Unauthorized' }, 401);

  let rawBody: unknown = {};
  if (req.headers.get('content-type')?.includes('application/json')) {
    try {
      rawBody = await req.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON in request body' }, 400);
    }
  }
  const bodyResult = RequestBodySchema.safeParse(rawBody);
  if (!bodyResult.success) {
    return jsonResponse({ error: 'Invalid request body', detail: bodyResult.error.flatten() }, 400);
  }
  const { price_usd: priceUsd, force_refresh: forceRefresh = false } = bodyResult.data;

  let account;
  try {
    account = await fetchAccount(supabase, user.id);
  } catch {
    return jsonResponse({ error: 'Account not found' }, 404);
  }

  const isPremium =
    account.premium_expires_at != null && new Date(account.premium_expires_at) > new Date();
  // Defensive fallback: country is non-nullable in the schema but guards against
  // any future schema drift or unexpected null coming from the DB.
  const country = account.country || 'Unknown';

  // force_refresh is a premium-only capability — reject at the server level.
  if (forceRefresh && !isPremium) {
    return jsonResponse({ error: 'force_refresh requires a premium account' }, 403);
  }

  let hobbies;
  try {
    hobbies = await fetchHobbies(supabase, user.id);
  } catch (e) {
    console.error('[generate-suggestions] fetchHobbies error', e);
    throw new Error('Database error fetching hobbies');
  }
  if (!hobbies.length) return jsonResponse({ suggestions: [] });

  const hobbyIds = hobbies.map((h) => h.id);
  const hobbyNames = hobbies.map((h) => h.hobby_name);

  // Serve from cache for all users unless an explicit refresh was requested.
  // The rate-limit counter only increments when we are actually about to call Gemini.
  if (!forceRefresh) {
    const cached = await fetchCachedSuggestions(supabase, hobbyIds, country);
    if (cached.length) return jsonResponse({ suggestions: cached });
  }

  const now = new Date();
  const windows = getWindowKeys(now);
  const allWindowKeys = [windows.min, windows.hour, windows.day, windows.month];

  // Peek at current counts before deciding to call Gemini (issue #2: no wasted increment
  // when we are about to fall back to cache anyway).
  // NOTE: A narrow race window exists between this read and the increment below — two
  // concurrent cache-miss requests could both pass the check and both call Gemini.
  // Under current traffic levels this is acceptable; a DB-level advisory lock on the
  // user_id would close it completely if needed.
  let currentCounts;
  try {
    currentCounts = await fetchRateLimitCounts(supabase, allWindowKeys);
  } catch (e) {
    console.error('[generate-suggestions] fetchRateLimitCounts error', e);
    throw new Error('Database error reading rate limit');
  }

  if (isPremium) {
    if (isOverPremiumCap(currentCounts, windows)) {
      const cached = await fetchCachedSuggestions(supabase, hobbyIds, country);
      return jsonResponse({ suggestions: cached });
    }
  } else {
    const exceeded = findExceededFreeWindow(currentCounts, windows);
    if (exceeded) {
      const retryAfter = secondsUntilNextWindow(now, exceeded);
      return jsonResponse({ error: 'Rate limit exceeded' }, 429, {
        'Retry-After': String(retryAfter),
      });
    }
  }

  const aiSuggestions = await callGemini(GEMINI_API_KEY, country, hobbyNames, priceUsd);

  const rows = toSuggestionRows(aiSuggestions, hobbies, country);

  let inserted;
  try {
    inserted = await replaceSuggestions(supabase, hobbyIds, country, rows);
  } catch (e) {
    console.error('[generate-suggestions] replaceSuggestions error', e);
    throw new Error('Database error persisting suggestions');
  }

  // Increment the rate-limit counter only after a successful end-to-end generation
  // (issue #1: do not consume a slot for a request that produced no suggestions).
  // A counter failure must not surface to the client — the suggestions were stored.
  try {
    await incrementRateLimit(supabase, allWindowKeys);
  } catch (e) {
    console.warn('[generate-suggestions] rate-limit increment failed (non-fatal)', e);
  }

  return jsonResponse({ suggestions: inserted });
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
