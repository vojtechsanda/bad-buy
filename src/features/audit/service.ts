import { supabase } from '@shared/services/supabase';
import type { AccountSuggestion } from '@shared/types';

/**
 * Fetch suggestions for the current user.
 *
 * Free users: returns cached suggestions if any exist for the current hobbies + country;
 * only calls Gemini when there is nothing cached (new hobby or new country).
 *
 * Premium users: always calls Gemini so the returned suggestions reflect the current
 * entered price.
 *
 * Pass `priceUsd` to steer Gemini toward alternatives around that budget.
 */
export async function fetchSuggestions(priceUsd?: number): Promise<AccountSuggestion[]> {
  const { data, error } = await supabase.functions.invoke<{ suggestions: AccountSuggestion[] }>(
    'generate-suggestions',
    { body: { price_usd: priceUsd } },
  );

  if (error) {
    const httpError = error as { context?: Response };
    const status = httpError.context?.status ?? 'unknown';
    const body = httpError.context
      ? await httpError.context.text().catch(() => '(unreadable)')
      : '';
    console.warn('[generate-suggestions] error', { status, body, message: error.message });
    throw error;
  }

  console.log('[generate-suggestions] ok', {
    suggestionCount: Array.isArray(data?.suggestions) ? data.suggestions.length : null,
  });

  return data?.suggestions ?? [];
}
