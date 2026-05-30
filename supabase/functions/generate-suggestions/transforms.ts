import type { GeminiSuggestion } from './schemas.ts';
import type { AccountHobbyRef, SuggestionInsertRow } from './types.ts';

export function toSuggestionRows(
  suggestions: GeminiSuggestion[],
  hobbies: AccountHobbyRef[],
  country: string,
): SuggestionInsertRow[] {
  if (!hobbies.length) {
    throw new Error('No hobbies available to map suggestions onto');
  }

  const hobbyMap = new Map(hobbies.map((h) => [h.hobby_name.toLowerCase(), h.id]));
  const rows: SuggestionInsertRow[] = [];

  for (const s of suggestions) {
    const hobbyId = hobbyMap.get(s.hobby_name.toLowerCase());
    if (!hobbyId) {
      console.warn(
        `[generate-suggestions] Unknown hobby name "${s.hobby_name}" from Gemini, skipping suggestion "${s.name}"`,
      );
      continue;
    }

    rows.push({
      hobby_id: hobbyId,
      name: s.name,
      item_emoji: s.item_emoji,
      price_usd: s.price_usd,
      country,
    });
  }

  if (!rows.length) {
    throw new Error('No suggestions could be mapped to known hobbies');
  }

  return rows;
}
