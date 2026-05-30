import { supabase } from '@shared/services/supabase';
import type { AccountSuggestion } from '@shared/types';

/**
 * Fetch suggestions for the current user.
 *
 * Both free and premium users are served from the cache unless `forceRefresh` is true.
 * A forced refresh bypasses the cache and triggers a new Gemini call — only available
 * to premium users via the explicit refresh button on the audit screen.
 *
 * Pass `priceUsd` to steer Gemini toward alternatives around that budget.
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
 * Delete all cached suggestions for the current user's hobbies so that the next
 * audit screen load generates fresh ones and shows a skeleton while loading.
 *
 * Intentionally does NOT filter by country: when the user changes their country,
 * the account row is updated before this runs, so reading country from the DB
 * would return the new value while old rows are keyed to the old one.
 */
export async function invalidateSuggestionsCache(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: hobbies } = await supabase
    .from('account_hobby')
    .select('id')
    .eq('account_id', user.id);

  if (!hobbies?.length) return;

  const hobbyIds = hobbies.map((h) => h.id);
  const { error } = await supabase.from('account_suggestion').delete().in('hobby_id', hobbyIds);

  if (error) {
    console.warn('[invalidateSuggestionsCache] failed to clear cache', error);
  }
}

/**
 * Invalidate the cached suggestions and kick off a background re-generation.
 * Call this (without await) after saving a hobby or country change.
 * Errors are logged and swallowed — callers must not depend on completion.
 */
export async function triggerBackgroundSuggestionsRefresh(): Promise<void> {
  try {
    await invalidateSuggestionsCache();
    void fetchSuggestions();
  } catch (err) {
    console.warn('[triggerBackgroundSuggestionsRefresh] failed', err);
  }
}
