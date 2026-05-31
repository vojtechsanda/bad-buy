import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.105.1';

import type { Database } from '../../../src/shared/types/database.ts';
import { SUGGESTION_COUNT } from './constants.ts';
import type {
  AccountContext,
  AccountHobbyRef,
  AccountSuggestion,
  SuggestionInsertRow,
} from './types.ts';

export type {
  AccountContext,
  AccountHobbyRef,
  AccountSuggestion,
  SuggestionInsertRow,
} from './types.ts';

export type Supabase = SupabaseClient<Database>;

function unwrap<T>({ data, error }: { data: T | null; error: unknown }): T {
  if (error) throw error;
  if (data === null) throw new Error('No data returned');
  return data;
}

function unwrapList<T>({ data, error }: { data: T[] | null; error: unknown }): T[] {
  if (error) throw error;
  return data ?? [];
}

export async function fetchAccount(supabase: Supabase, userId: string): Promise<AccountContext> {
  return unwrap(
    await supabase.from('account').select('country, premium_expires_at').eq('id', userId).single(),
  );
}

export async function fetchHobbies(supabase: Supabase, userId: string): Promise<AccountHobbyRef[]> {
  return unwrapList(
    await supabase
      .from('account_hobby')
      .select('id, hobby_name')
      .eq('account_id', userId)
      .eq('is_moderated', true),
  );
}

export async function fetchRateLimitCounts(
  supabase: Supabase,
  windowKeys: string[],
): Promise<Map<string, number>> {
  const data = unwrap(
    await supabase.rpc('read_suggestion_rate_limit', { p_window_keys: windowKeys }),
  );

  return new Map(data.map((r) => [r.out_window_key, r.out_count]));
}

export async function incrementRateLimit(
  supabase: Supabase,
  windowKeys: string[],
): Promise<Map<string, number>> {
  const data = unwrap(
    await supabase.rpc('increment_suggestion_rate_limit', { p_window_keys: windowKeys }),
  );

  return new Map(data.map((r) => [r.out_window_key, r.out_count]));
}

export async function fetchCachedSuggestions(
  supabase: Supabase,
  hobbyIds: string[],
  country: string,
): Promise<AccountSuggestion[]> {
  if (!hobbyIds.length) return [];

  return unwrapList(
    await supabase
      .from('account_suggestion')
      .select('*')
      .in('hobby_id', hobbyIds)
      .eq('country', country)
      .order('generated_at', { ascending: false })
      .order('id', { ascending: true })
      .limit(SUGGESTION_COUNT),
  );
}

export async function replaceSuggestions(
  supabase: Supabase,
  hobbyIds: string[],
  country: string,
  rows: SuggestionInsertRow[],
): Promise<AccountSuggestion[]> {
  return unwrapList(
    await supabase.rpc('replace_suggestions', {
      p_hobby_ids: hobbyIds,
      p_country: country,
      p_rows: rows,
    }),
  );
}
