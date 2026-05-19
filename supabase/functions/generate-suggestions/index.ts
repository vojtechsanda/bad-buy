import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.105.1';
import { corsHeaders } from 'https://esm.sh/@supabase/supabase-js@2.105.1/cors';
import { z } from 'https://esm.sh/zod@3';

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
// Gemini config
// =============================================================================

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
/** Must stay under Supabase Edge Function max duration for your plan. */
const GEMINI_TIMEOUT_MS = 60_000;

/** OpenAPI-style schema sent to Gemini for structured JSON output. */
const GEMINI_RESPONSE_SCHEMA = {
  type: 'array',
  minItems: 5,
  maxItems: 5,
  description: 'Exactly 5 alternative purchase suggestions.',
  items: {
    type: 'object',
    required: ['hobby_name', 'name', 'item_emoji', 'price_usd'],
    propertyOrdering: ['hobby_name', 'name', 'item_emoji', 'price_usd'],
    properties: {
      hobby_name: {
        type: 'string',
        description: 'One of the hobbies from the prompt, spelled exactly.',
      },
      name: { type: 'string', description: 'Product name, 2–5 words.' },
      item_emoji: { type: 'string', description: 'A single emoji for the item.' },
      price_usd: {
        type: 'number',
        minimum: 0.01,
        description: 'USD equivalent of a typical local-market price (positive number).',
      },
    },
  },
};

// =============================================================================
// Validation schemas
// =============================================================================

const RequestBodySchema = z.object({
  /** USD amount the user is about to spend — used to steer suggestion price range. */
  price_usd: z.number().positive().optional(),
});

const GeminiSuggestionSchema = z.object({
  hobby_name: z.string().min(1),
  name: z.string().min(1),
  item_emoji: z.string().min(1),
  price_usd: z.number().positive(),
});

const GeminiResponseSchema = z.array(GeminiSuggestionSchema).length(5);

const GeminiEnvelopeSchema = z.object({
  candidates: z
    .array(
      z.object({
        content: z.object({
          parts: z.array(z.object({ text: z.string().min(1) })).min(1),
        }),
      }),
    )
    .min(1),
});

// =============================================================================
// Types
// =============================================================================

type GeminiSuggestion = z.infer<typeof GeminiSuggestionSchema>;
type Hobby = { id: string; hobby_name: string };
type SuggestionRow = {
  hobby_id: string;
  name: string;
  item_emoji: string;
  price_usd: number;
  country: string;
};

// =============================================================================
// Gemini helpers
// =============================================================================

function buildPrompt(country: string, hobbyNames: string, budgetUsd?: number): string {
  const budgetLine = budgetUsd
    ? `The user is about to spend roughly $${budgetUsd.toFixed(2)} USD. Aim for suggestions around that price range (within ~50% above or below).`
    : 'Aim for a realistic everyday price range for each suggestion.';

  return `You are helping a user of a personal finance app who lives in ${country}.
Their hobbies are: ${hobbyNames}.

Generate exactly 5 alternative purchase suggestions they could genuinely enjoy — related to those hobbies, as alternatives when they are about to make an impulse buy.

Requirements:
- Each suggestion must fit ${country}: realistic local products, availability, and prices (not generic US-only). Use hobby_name from the list above, spelled exactly.
- price_usd must be the USD equivalent of the typical local price (a positive number).
- ${budgetLine}

Output must follow the response JSON schema only (no markdown, no extra text).`;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 0,
  delayMs = 1000,
): Promise<Response> {
  const res = await fetch(url, options);
  if (!res.ok && res.status >= 500 && retries > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return fetchWithRetry(url, options, retries - 1, delayMs);
  }
  return res;
}

async function callGemini(
  country: string,
  hobbyNames: string,
  budgetUsd?: number,
): Promise<GeminiSuggestion[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetchWithRetry(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(country, hobbyNames, budgetUsd) }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseJsonSchema: GEMINI_RESPONSE_SCHEMA,
        },
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 500);
    throw new Error(`Gemini ${res.status} (${GEMINI_MODEL}): ${detail}`);
  }

  const envelope = GeminiEnvelopeSchema.safeParse(await res.json());
  if (!envelope.success) {
    console.error('[generate-suggestions] Unexpected Gemini envelope', envelope.error.flatten());
    throw new Error('Gemini returned an unexpected response shape');
  }

  const rawText = envelope.data.candidates[0].content.parts[0].text;
  let rawJson: unknown;
  try {
    rawJson = JSON.parse(rawText);
  } catch {
    throw new Error(`Gemini returned malformed JSON: ${rawText.slice(0, 200)}`);
  }

  const parsed = GeminiResponseSchema.safeParse(rawJson);
  if (!parsed.success) {
    console.error(
      '[generate-suggestions] Gemini response failed validation',
      parsed.error.flatten(),
    );
    throw new Error('Gemini returned an invalid response');
  }

  return parsed.data;
}

// =============================================================================
// DB helpers
// =============================================================================

function toSuggestionRows(
  suggestions: GeminiSuggestion[],
  hobbies: Hobby[],
  country: string,
): SuggestionRow[] {
  const hobbyMap = new Map(hobbies.map((h) => [h.hobby_name.toLowerCase(), h.id]));
  const fallbackId = hobbies[0].id;

  return suggestions.map((s) => ({
    hobby_id: hobbyMap.get(s.hobby_name.toLowerCase()) ?? fallbackId,
    name: s.name,
    item_emoji: s.item_emoji,
    price_usd: s.price_usd,
    country,
  }));
}

// =============================================================================
// Request handler
// =============================================================================

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleRequest(req: Request): Promise<Response> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return jsonResponse({ error: 'Missing authorization' }, 401);

  // Use the caller's JWT so RLS applies; the function only sees that user's rows.
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
  const { price_usd: priceUsd } = RequestBodySchema.parse(rawBody);

  const { data: account, error: accountError } = await supabase
    .from('account')
    .select('country, premium_expires_at')
    .eq('id', user.id)
    .single();
  if (accountError || !account) return jsonResponse({ error: 'Account not found' }, 404);

  const isPremium =
    account.premium_expires_at != null && new Date(account.premium_expires_at) > new Date();
  const { country } = account;

  const { data: hobbies, error: hobbiesError } = await supabase
    .from('account_hobby')
    .select('id, hobby_name')
    .eq('account_id', user.id)
    .eq('is_moderated', true);
  if (hobbiesError) throw hobbiesError;
  if (!hobbies?.length) return jsonResponse({ suggestions: [] });

  const hobbyIds = hobbies.map((h) => h.id);

  // Free users: return cached suggestions if any exist for this hobby+country combo.
  // Premium users: always regenerate so suggestions reflect the current entered price.
  if (!isPremium) {
    const { data: cached } = await supabase
      .from('account_suggestion')
      .select('*')
      .in('hobby_id', hobbyIds)
      .eq('country', country);
    if (cached?.length) return jsonResponse({ suggestions: cached });
  }

  const aiSuggestions = await callGemini(
    country,
    hobbies.map((h) => h.hobby_name).join(', '),
    priceUsd,
  );
  const rows = toSuggestionRows(aiSuggestions, hobbies, country);

  // Replace all existing suggestions for these hobbies + country so old rows
  // don't accumulate.
  const { error: deleteError } = await supabase
    .from('account_suggestion')
    .delete()
    .in('hobby_id', hobbyIds)
    .eq('country', country);
  if (deleteError) throw deleteError;

  const { data: inserted, error: insertError } = await supabase
    .from('account_suggestion')
    .insert(rows)
    .select();
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
