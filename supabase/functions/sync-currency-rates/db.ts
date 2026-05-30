import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.105.1';

import type { CurrencyInsert, CurrencyRateInsert } from '../../../src/shared/types/index.ts';

export async function fetchCountryCurrencyCodes(supabase: SupabaseClient): Promise<Set<string>> {
  const { data, error } = await supabase.from('country').select('default_currency');
  if (error) throw error;

  return new Set((data ?? []).map((row: { default_currency: string }) => row.default_currency));
}

export async function upsertCurrencies(supabase: SupabaseClient, rows: CurrencyInsert[]) {
  const { error } = await supabase.from('currency').upsert(rows, {
    onConflict: 'code',
    ignoreDuplicates: true,
  });
  if (error) throw error;
}

export async function upsertRates(supabase: SupabaseClient, rows: CurrencyRateInsert[]) {
  const { error } = await supabase.from('currency_rate').upsert(rows, {
    onConflict: 'base,target',
  });
  if (error) throw error;
}
