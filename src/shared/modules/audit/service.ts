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

/**
 * Delete all cached suggestions for the current user's hobbies + country so that
 * the next audit screen load generates fresh ones and shows a skeleton while loading.
 */
export async function invalidateSuggestionsCache(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const [{ data: account }, { data: hobbies }] = await Promise.all([
    supabase.from('account').select('country').eq('id', user.id).single(),
    supabase.from('account_hobby').select('id').eq('account_id', user.id),
  ]);

  if (!account || !hobbies?.length) return;

  const hobbyIds = hobbies.map((h) => h.id);
  const { error } = await supabase
    .from('account_suggestion')
    .delete()
    .in('hobby_id', hobbyIds)
    .eq('country', account.country);

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
