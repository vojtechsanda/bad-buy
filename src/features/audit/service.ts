import { supabase } from '@shared/services/supabase';
import type { AccountSuggestion } from '@shared/types';

async function invokeSuggestions(forceRefresh = false): Promise<AccountSuggestion[]> {
  // call supabase edge function
  const { data, error } = await supabase.functions.invoke<{ suggestions: AccountSuggestion[] }>(
    'generate-suggestions',
    { body: { force_refresh: forceRefresh } },
  );

  if (error) throw error;

  return data?.suggestions ?? [];
}

/**
 * Get suggestions for the current user.
 *
 * Only generates new suggestions if none exist for the current country and hobbies
 */
export function fetchSuggestions(): Promise<AccountSuggestion[]> {
  return invokeSuggestions();
}

/**
 * Regenerate suggestions for the current user (premium only).
 *
 * Throws a `FunctionsHttpError` on failure. Check `error.context?.status === 403`
 * to distinguish a paywall error from a generic failure.
 */
export function refreshSuggestions(): Promise<AccountSuggestion[]> {
  return invokeSuggestions(true);
}
