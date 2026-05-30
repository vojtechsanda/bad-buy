import { z } from 'https://esm.sh/zod@3';

/** Stable Flash-Lite model — see https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite */
const GEMINI_MODEL = 'gemini-3.1-flash-lite';
const GEMINI_BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const GEMINI_TIMEOUT_MS = 30_000;
const SUGGESTION_COUNT = 5;

/**
 * OpenAPI-style schema sent to Gemini for structured JSON output.
 *
 * Notes:
 * - minItems/maxItems are advisory for Gemini — it does not enforce them as a JSON
 *   Schema validator would. The real length guard is GeminiResponseSchema (.length(5)).
 * - propertyOrdering is a Gemini-specific extension (non-standard JSON Schema). It
 *   nudges the model to emit fields in a consistent order; do not remove it assuming
 *   it is dead code.
 */
const GEMINI_RESPONSE_SCHEMA = {
  type: 'array',
  minItems: SUGGESTION_COUNT,
  maxItems: SUGGESTION_COUNT,
  description: `Exactly ${SUGGESTION_COUNT} alternative purchase suggestions.`,
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

const GeminiSuggestionSchema = z.object({
  hobby_name: z.string().min(1),
  name: z.string().min(1),
  // Emojis can be multi-codepoint sequences (e.g. family emoji = 11 code units).
  // .max(10) rejects obvious non-emoji strings while allowing all standard emoji.
  item_emoji: z.string().min(1).max(10),
  price_usd: z.number().positive(),
});

const GeminiResponseSchema = z.array(GeminiSuggestionSchema).length(SUGGESTION_COUNT);

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

export type GeminiSuggestion = z.infer<typeof GeminiSuggestionSchema>;

/**
 * Strip newlines and truncate to `maxLen` characters.
 * Prevents prompt injection from DB-sourced strings (country, hobby names).
 */
function sanitisePromptValue(value: string, maxLen: number): string {
  return value
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function buildPrompt(country: string, hobbyNames: string[], budgetUsd?: number): string {
  const safeCountry = sanitisePromptValue(country, 100);
  const safeHobbies = hobbyNames
    .map((h) => sanitisePromptValue(h, 60))
    .filter(Boolean)
    .join(', ');

  const budgetLine =
    budgetUsd != null && budgetUsd > 0
      ? `The user is about to spend roughly $${budgetUsd.toFixed(2)} USD. Aim for suggestions around that price range (within ~50% above or below).`
      : 'Aim for a realistic everyday price range for each suggestion.';

  return `You are helping a user of a personal finance app who lives in ${safeCountry}.
Their hobbies are: ${safeHobbies}.

Generate exactly ${SUGGESTION_COUNT} alternative purchase suggestions they could genuinely enjoy — related to those hobbies, as alternatives when they are about to make an impulse buy.

Requirements:
- Each suggestion must fit ${safeCountry}: realistic local products, availability, and prices (not generic US-only). Use hobby_name from the list above, spelled exactly.
- price_usd must be the USD equivalent of the typical local price (a positive number).
- ${budgetLine}

Output must follow the response JSON schema only (no markdown, no extra text).`;
}

/**
 * Retries only on 5xx responses. Each attempt gets its own AbortController so
 * that a near-timeout on the first attempt doesn't immediately abort subsequent
 * retries. The retry delay grows exponentially with ±25 % jitter to avoid
 * thundering-herd behaviour under Gemini overload.
 *
 * Abort/network errors (not HTTP errors) propagate immediately — we don't retry
 * after our own deadline fires.
 */
async function fetchWithRetry(
  url: string,
  options: Omit<RequestInit, 'signal'>,
  timeoutMs: number,
  retries = 2,
  baseDelayMs = 1000,
  attempt = 0,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok && res.status >= 500 && retries > 0) {
    const jitter = 1 + (Math.random() - 0.5) * 0.5; // ±25 %
    const delay = baseDelayMs * Math.pow(2, attempt) * jitter;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return fetchWithRetry(url, options, timeoutMs, retries - 1, baseDelayMs, attempt + 1);
  }

  return res;
}

export async function callGemini(
  apiKey: string,
  country: string,
  hobbyNames: string[],
  budgetUsd?: number,
): Promise<GeminiSuggestion[]> {
  // API key is passed as a query parameter rather than a header so it is
  // typically scrubbed from structured log payloads by most logging pipelines.
  const url = `${GEMINI_BASE_URL}?key=${encodeURIComponent(apiKey)}`;

  const res = await fetchWithRetry(
    url,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(country, hobbyNames, budgetUsd) }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseJsonSchema: GEMINI_RESPONSE_SCHEMA,
        },
      }),
    },
    GEMINI_TIMEOUT_MS,
  );

  // Response body is consumed exactly once below — keep error and success paths mutually exclusive.
  if (!res.ok) {
    // Limit and sanitise the detail: strip newlines and cap at 100 chars to
    // avoid leaking quota identifiers or project metadata into Supabase logs.
    const rawDetail = await res.text().catch(() => '');
    const detail = rawDetail.split('\n')[0].trim().slice(0, 100);
    throw new Error(`Gemini ${res.status} (${GEMINI_MODEL}): ${detail}`);
  }

  const envelope = GeminiEnvelopeSchema.safeParse(await res.json());
  if (!envelope.success) {
    console.error('[generate-suggestions] Unexpected Gemini envelope', envelope.error.flatten());
    throw new Error(
      `Gemini envelope validation failed: ${envelope.error.issues[0]?.message ?? 'unknown error'}`,
    );
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
    throw new Error(
      `Gemini response validation failed: ${parsed.error.issues[0]?.message ?? 'unknown error'}`,
    );
  }

  console.log(`[generate-suggestions] Gemini returned ${parsed.data.length} suggestions`);

  return parsed.data;
}
