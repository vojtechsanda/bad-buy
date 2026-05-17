import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.105.1';
import { corsHeaders } from 'https://esm.sh/@supabase/supabase-js@2.105.1/cors';
import { z } from 'https://esm.sh/zod@3';

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);

  return value;
}

const GEMINI_API_KEY = requireEnv('GEMINI_API_KEY');
const SUPABASE_URL = requireEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY = requireEnv('SUPABASE_ANON_KEY');

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_RETRIES = 1;

const RequestBodySchema = z.object({
  force_refresh: z.boolean().optional().default(false),
});

const GeminiSuggestionSchema = z.object({
  hobby_name: z.string().min(1),
  name: z.string().min(1),
  item_emoji: z.string().min(1),
  price_usd: z.number().positive(),
});

const GeminiResponseSchema = z.array(GeminiSuggestionSchema).length(5);

// Validates the Gemini HTTP response envelope before we touch any nested fields.
// Ensures candidates[0].content.parts[0].text exists and is non-empty.
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

type GeminiSuggestion = z.infer<typeof GeminiSuggestionSchema>;
type Hobby = { id: string; hobby_name: string };
type SuggestionRow = {
  hobby_id: string;
  name: string;
  item_emoji: string;
  price_usd: number;
  country: string;
};

function createJsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
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

function buildSuggestionsPrompt(country: string, hobbyNames: string): string {
  return `You are helping a user of a personal finance app who lives in ${country}.
Their hobbies are: ${hobbyNames}.

Generate exactly 5 alternative purchase suggestions this person could genuinely enjoy — things related to their hobbies, shown as alternatives when they are about to make an impulse buy.

Every suggestion must be appropriate for someone living in ${country}: typical local availability, brands or product types people actually buy there, and prices that reflect what they would realistically pay in that market (not generic US-only pricing). Express each price as price_usd: the USD equivalent of that typical local price, as a number.

Return ONLY a valid JSON array with exactly 5 items. No markdown, no explanation, just the array:
[
  {
    "hobby_name": "<one of the provided hobby names, spelled exactly>",
    "name": "<item name, 2-5 words>",
    "item_emoji": "<single emoji>",
    "price_usd": <typical local-market price for ${country}, converted to USD as a number>
  }
]`;
}

async function callGemini(country: string, hobbyNames: string): Promise<GeminiSuggestion[]> {
  const prompt = buildSuggestionsPrompt(country, hobbyNames);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  let res: Response;
  try {
    res = await fetchWithRetry(
      GEMINI_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
        signal: controller.signal,
      },
      GEMINI_RETRIES,
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) throw new Error(`Gemini API responded with status ${res.status}`);

  const envelopeParsed = GeminiEnvelopeSchema.safeParse(await res.json());
  if (!envelopeParsed.success) {
    console.error(
      '[generate-suggestions] Unexpected Gemini envelope',
      envelopeParsed.error.flatten(),
    );
    throw new Error('Gemini returned an unexpected response shape');
  }
  const rawText = envelopeParsed.data.candidates[0].content.parts[0].text;

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

function toSuggestionRows(
  aiSuggestions: GeminiSuggestion[],
  hobbies: Hobby[],
  country: string,
): SuggestionRow[] {
  // Map hobby_name → hobby_id; fall back to first hobby if Gemini misspelled a name
  const hobbyMap = new Map(hobbies.map((h) => [h.hobby_name.toLowerCase(), h.id]));
  const fallbackHobbyId = hobbies[0].id;

  return aiSuggestions.map((s) => ({
    hobby_id: hobbyMap.get(s.hobby_name.toLowerCase()) ?? fallbackHobbyId,
    name: s.name,
    item_emoji: s.item_emoji,
    price_usd: s.price_usd,
    country,
  }));
}

async function handleRequest(req: Request): Promise<Response> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return createJsonResponse({ error: 'Missing authorization' }, 401);

  // Use user's JWT so RLS applies correctly — we can only see/modify our own data.
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return createJsonResponse({ error: 'Unauthorized' }, 401);

  // Falls back to {} when Content-Type is absent/wrong (uses force_refresh: false by default)
  const rawBody = req.headers.get('content-type')?.includes('application/json')
    ? await req.json()
    : {};
  const { force_refresh: forceRefresh } = RequestBodySchema.parse(rawBody);

  const { data: account, error: accountError } = await supabase
    .from('account')
    .select('country, premium_expires_at')
    .eq('id', user.id)
    .single();
  if (accountError || !account) return createJsonResponse({ error: 'Account not found' }, 404);

  const { country } = account;

  if (forceRefresh) {
    const isPremium =
      account.premium_expires_at != null && new Date(account.premium_expires_at) > new Date();
    if (!isPremium)
      return createJsonResponse({ error: 'Premium required to refresh suggestions' }, 403);
  }

  const { data: hobbies, error: hobbiesError } = await supabase
    .from('account_hobby')
    .select('id, hobby_name')
    .eq('account_id', user.id)
    .eq('is_moderated', true);
  if (hobbiesError) throw hobbiesError;
  if (!hobbies || hobbies.length === 0) return createJsonResponse({ suggestions: [] });

  const hobbyIds = hobbies.map((h) => h.id);

  if (!forceRefresh) {
    const { data: cached } = await supabase
      .from('account_suggestion')
      .select('*')
      .in('hobby_id', hobbyIds)
      .eq('country', country);

    if (cached && cached.length > 0) return createJsonResponse({ suggestions: cached });
  }

  const hobbyNames = hobbies.map((h) => h.hobby_name).join(', ');
  const aiSuggestions = await callGemini(country, hobbyNames);
  const rows = toSuggestionRows(aiSuggestions, hobbies, country);

  const { data: inserted, error: insertError } = await supabase
    .from('account_suggestion')
    .upsert(rows, { onConflict: 'hobby_id,country' })
    .select();
  if (insertError) throw insertError;

  return createJsonResponse({ suggestions: inserted });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    return await handleRequest(req);
  } catch (err) {
    console.error('[generate-suggestions]', err);

    return createJsonResponse({ error: 'Internal server error' }, 500);
  }
});
