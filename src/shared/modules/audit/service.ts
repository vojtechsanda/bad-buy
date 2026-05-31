import { authService } from '@features/auth';
import { supabase } from '@shared/services/supabase';
import type { AccountSuggestion } from '@shared/types';

const SUGGESTION_COUNT = 5;

/**
 * Reads cached suggestions for the current user directly from the database.
 * No AI call is made. Returns whatever is stored for the user's current
 * hobbies + country combination.
 */
export async function readCachedSuggestions(): Promise<AccountSuggestion[]> {
  const userId = await authService.getCurrentUserId();

  const [{ data: hobbies }, { data: account }] = await Promise.all([
    supabase.from('account_hobby').select('id').eq('account_id', userId).eq('is_moderated', true),
    supabase.from('account').select('country').eq('id', userId).single(),
  ]);

  const hobbyIds = hobbies?.map((h) => h.id) ?? [];
  const country = account?.country ?? null;

  if (!hobbyIds.length || !country) return [];

  const { data } = await supabase
    .from('account_suggestion')
    .select('*')
    .in('hobby_id', hobbyIds)
    .eq('country', country)
    .order('generated_at', { ascending: false })
    .order('id', { ascending: true })
    .limit(SUGGESTION_COUNT);

  return data ?? [];
}

/**
 * Calls the generate-suggestions edge function for the current user.
 * Pass `forceRefresh: true` to bypass the server-side cache (premium only).
 * Pass `priceUsd` to set the budget context for the AI.
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
 * Triggers a background suggestions generation after hobby or country changes.
 * Uses the normal cache-miss path (no force_refresh) so both free and premium
 * users receive fresh suggestions when their hobbies change.
 */
export function triggerBackgroundSuggestionsRefresh(): void {
  void fetchSuggestions(undefined, false).catch((err) => {
    console.warn('[triggerBackgroundSuggestionsRefresh] background fetch failed', err);
  });
}
