import { supabase } from '@shared/services/supabase';
import type { AccountSuggestion } from '@shared/types';

/**
 * Fetch suggestions for the current user.
 *
 * Both free and premium users are served from the cache unless `forceRefresh` is true.
 * A forced refresh bypasses the cache and triggers a new Gemini call — only available
 * to premium users via the explicit refresh button on the audit screen.
 *
 * Pass `priceUsd` to set the budget.
 */
export async function fetchSuggestions(
  priceUsd?: number,
  forceRefresh = false,
): Promise<AccountSuggestion[]> {
  const { data, error } = await supabase.functions.invoke<{ suggestions: AccountSuggestion[] }>(
    'generate-suggestions',
    { body: { price_usd: priceUsd, force_refresh: forceRefresh } },
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

  return data?.suggestions ?? [];
}

/**
 * Triggers a forced refresh
 * */
export function triggerBackgroundSuggestionsRefresh(): void {
  void fetchSuggestions(undefined, true).catch((err) => {
    console.warn('[triggerBackgroundSuggestionsRefresh] background fetch failed', err);
  });
}
