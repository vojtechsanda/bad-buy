import { z } from 'https://esm.sh/zod@3';

import { SUGGESTION_COUNT } from './constants.ts';

export const RequestBodySchema = z.object({
  price_usd: z.number().positive().optional(),
  force_refresh: z.boolean().optional(),
});

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
export const GEMINI_RESPONSE_SCHEMA = {
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

export const GeminiSuggestionSchema = z.object({
  hobby_name: z.string().min(1),
  name: z.string().min(1),
  // Emojis can be multi-codepoint sequences (e.g. family emoji = 11 code units).
  // .max(10) rejects obvious non-emoji strings while allowing all standard emoji.
  item_emoji: z.string().min(1).max(10),
  price_usd: z.number().positive(),
});

export const GeminiResponseSchema = z.array(GeminiSuggestionSchema).length(SUGGESTION_COUNT);

export const GeminiEnvelopeSchema = z.object({
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
