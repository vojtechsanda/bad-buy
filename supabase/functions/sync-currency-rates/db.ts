import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.105.1';

// =============================================================================
// Types
// =============================================================================

export type CurrencyRow = { code: string; name: string; symbol: string };

export type RateRow = { base: string; target: string; rate: number; fetched_at: string };

// =============================================================================
// Queries
// =============================================================================

/** Inserts new currencies only — existing rows (with curated symbols) are left untouched. */
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
