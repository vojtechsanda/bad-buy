import { z } from 'https://esm.sh/zod@3';

const GEMINI_MODEL = 'gemini-3.1-flash-lite';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const GEMINI_TIMEOUT_MS = 30_000;

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

export type GeminiSuggestion = z.infer<typeof GeminiSuggestionSchema>;

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
  retries = 2,
  delayMs = 1000,
): Promise<Response> {
  const res = await fetch(url, options);
  if (!res.ok && res.status >= 500 && retries > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return fetchWithRetry(url, options, retries - 1, delayMs);
  }
  return res;
}

export async function callGemini(
  apiKey: string,
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
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
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
