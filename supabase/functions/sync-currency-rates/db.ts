import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.105.1';

export type CurrencyRow = { code: string; name: string; symbol: string };

export type RateRow = { base: string; target: string; rate: number; fetched_at: string };

export async function fetchCountryCurrencyCodes(supabase: SupabaseClient): Promise<Set<string>> {
  const { data, error } = await supabase.from('country').select('default_currency');
  if (error) throw error;

  return new Set((data ?? []).map((row: { default_currency: string }) => row.default_currency));
}

export async function upsertCurrencies(supabase: SupabaseClient, rows: CurrencyRow[]) {
  const { error } = await supabase.from('currency').upsert(rows, {
    onConflict: 'code',
    ignoreDuplicates: true,
  });
  if (error) throw error;
}

export async function upsertRates(supabase: SupabaseClient, rows: RateRow[]) {
  const { error } = await supabase.from('currency_rate').upsert(rows, {
    onConflict: 'base,target',
  });
  if (error) throw error;
}
