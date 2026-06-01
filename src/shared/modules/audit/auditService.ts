import { supabase } from '@shared/services/supabase';
import type { AccountSuggestion } from '@shared/types';

/**
 * Calls the generate-suggestions edge function for the current user.
 * Pass `forceRefresh: true` to bypass the server-side cache (premium only).
 * Pass `priceUsd` to set the budget context for the AI.
 */
async function fetchSuggestions(
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
 * Triggers a background suggestions generation after hobby or country changes.
 * Uses the normal cache-miss path (no force_refresh) so both free and premium
 * users receive fresh suggestions when their hobbies change.
 */
function triggerBackgroundSuggestionsRefresh(): void {
  void fetchSuggestions(undefined, false).catch((err) => {
    console.warn('[triggerBackgroundSuggestionsRefresh] background fetch failed', err);
  });
}

export const auditService = {
  fetchSuggestions,
  triggerBackgroundSuggestionsRefresh,
};
