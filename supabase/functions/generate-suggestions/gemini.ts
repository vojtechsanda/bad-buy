import { GEMINI_BASE_URL, GEMINI_MODEL, GEMINI_TIMEOUT_MS, SUGGESTION_COUNT } from './constants.ts';
import {
  type GeminiSuggestion,
  geminiEnvelopeSchema,
  geminiResponseJsonSchema,
  geminiResponseSchema,
} from './schemas.ts';

export type { GeminiSuggestion };

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
      ? `The user is about to spend roughly $${budgetUsd.toFixed(2)} USD. Aim for suggestions around that price range (within ~15% above or below).`
      : 'Aim for a realistic everyday price range for each suggestion.';

  return `You are helping a user of a personal finance app who lives in ${safeCountry}.
Their hobbies are: ${safeHobbies}.

Generate exactly ${SUGGESTION_COUNT} alternative purchase suggestions they could genuinely enjoy — related to those hobbies, as alternatives when they are about to make an impulse buy.

Requirements:
- Each suggestion must fit ${safeCountry}: realistic local products, availability, and prices (not generic US-only). Use hobby_name from the list above, spelled exactly.
- Suggestions must be appropriate for all ages: no weapons, alcohol, tobacco, gambling, or adult content.
- price_usd must be the USD equivalent of the typical local price (a positive number).
- ${budgetLine}

Output must follow the response JSON schema only (no markdown, no extra text).`;
}

/**
 * Retries only on 5xx responses.
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

  // retry with jitter and exponential backoff
  if (!res.ok && res.status >= 500 && retries > 0) {
    const jitter = 1 + (Math.random() - 0.5) * 0.5; // ±25 % jitter
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
          responseJsonSchema: geminiResponseJsonSchema,
        },
      }),
    },
    GEMINI_TIMEOUT_MS,
  );

  if (!res.ok) {
    const rawDetail = await res.text().catch(() => '');
    const detail = rawDetail.split('\n')[0].trim().slice(0, 100);
    throw new Error(`Gemini ${res.status} (${GEMINI_MODEL}): ${detail}`);
  }

  const envelope = geminiEnvelopeSchema.safeParse(await res.json());
  if (!envelope.success) {
    console.error(
      '[generate-suggestions] Unexpected Gemini envelope',
      envelope.error.format((issue) => issue.message),
    );
    throw new Error(
      `Gemini envelope validation failed: ${envelope.error.issues[0]?.message ?? 'unknown error'}`,
    );
  }

  const candidate = envelope.data.candidates[0];
  if (candidate.finishReason && candidate.finishReason !== 'STOP') {
    throw new Error(`Gemini did not finish normally (finishReason: ${candidate.finishReason})`);
  }

  const rawText = candidate.content.parts[0].text;
  let rawJson: unknown;
  try {
    rawJson = JSON.parse(rawText);
  } catch {
    throw new Error(`Gemini returned malformed JSON: ${rawText.slice(0, 200)}`);
  }

  const parsed = geminiResponseSchema.safeParse(rawJson);
  if (!parsed.success) {
    console.error(
      '[generate-suggestions] Gemini response failed validation',
      parsed.error.format((issue) => issue.message),
    );
    throw new Error(
      `Gemini response validation failed: ${parsed.error.issues[0]?.message ?? 'unknown error'}`,
    );
  }

  console.log(`[generate-suggestions] Gemini returned ${parsed.data.length} suggestions`);

  return parsed.data;
}
