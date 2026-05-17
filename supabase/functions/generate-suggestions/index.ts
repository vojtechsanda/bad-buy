import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.105.1';
import { z } from 'https://esm.sh/zod@3';

import {
  fetchAccount,
  fetchCachedSuggestions,
  fetchHobbies,
  incrementRateLimit,
  replaceSuggestions,
  toSuggestionRows,
} from './db.ts';
import { callGemini } from './gemini.ts';
import {
  findExceededFreeWindow,
  getWindowKeys,
  isOverPremiumCap,
  secondsUntilNextWindow,
} from './rate-limit.ts';

// =============================================================================
// Environment
// =============================================================================

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const GEMINI_API_KEY = requireEnv('GEMINI_API_KEY');
const SUPABASE_URL = requireEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY = requireEnv('SUPABASE_ANON_KEY');

// =============================================================================
// HTTP helpers
// =============================================================================

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

// =============================================================================
// Validation
// =============================================================================

const RequestBodySchema = z.object({
  /** USD amount the user is about to spend — used to steer suggestion price range. */
  price_usd: z.number().positive().optional(),
});

// =============================================================================
// Request handler
// =============================================================================

async function handleRequest(req: Request): Promise<Response> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return jsonResponse({ error: 'Missing authorization' }, 401);

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return jsonResponse({ error: 'Unauthorized' }, 401);

  const rawBody = req.headers.get('content-type')?.includes('application/json')
    ? await req.json()
    : {};
  const bodyResult = RequestBodySchema.safeParse(rawBody);
  if (!bodyResult.success) {
    return jsonResponse({ error: 'Invalid request body', detail: bodyResult.error.flatten() }, 400);
  }
  const { price_usd: priceUsd } = bodyResult.data;

  const { data: account, error: accountError } = await fetchAccount(supabase, user.id);
  if (accountError || !account) return jsonResponse({ error: 'Account not found' }, 404);

  const isPremium =
    account.premium_expires_at != null && new Date(account.premium_expires_at) > new Date();
  const { country } = account;

  const { data: hobbies, error: hobbiesError } = await fetchHobbies(supabase, user.id);
  if (hobbiesError) throw hobbiesError;
  if (!hobbies?.length) return jsonResponse({ suggestions: [] });

  const hobbyIds = hobbies.map((h: { id: string }) => h.id);

  const now = new Date();
  const windows = getWindowKeys(now);
  const allWindowKeys = [windows.min, windows.hour, windows.day, windows.month];

  const countMap = await incrementRateLimit(supabase, user.id, allWindowKeys);

  if (isPremium) {
    if (isOverPremiumCap(countMap, windows)) {
      const { data: cached } = await fetchCachedSuggestions(supabase, hobbyIds, country);
      return jsonResponse({ suggestions: cached ?? [] });
    }
  } else {
    const exceeded = findExceededFreeWindow(countMap, windows);
    if (exceeded) {
      const retryAfter = secondsUntilNextWindow(now, exceeded);
      return jsonResponse({ error: 'Rate limit exceeded' }, 429, {
        'Retry-After': String(retryAfter),
      });
    }
  }

  if (!isPremium) {
    const { data: cached } = await fetchCachedSuggestions(supabase, hobbyIds, country);
    if (cached?.length) return jsonResponse({ suggestions: cached });
  }

  const aiSuggestions = await callGemini(
    GEMINI_API_KEY,
    country,
    hobbies.map((h: { hobby_name: string }) => h.hobby_name).join(', '),
    priceUsd,
  );

  const rows = toSuggestionRows(aiSuggestions, hobbies, country);

  const { data: inserted, error: insertError } = await replaceSuggestions(
    supabase,
    hobbyIds,
    country,
    rows,
  );
  if (insertError) throw insertError;

  return jsonResponse({ suggestions: inserted });
}

// =============================================================================
// Entry point
// =============================================================================

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    return await handleRequest(req);
  } catch (err) {
    console.error('[generate-suggestions]', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});
