import {
  type ChannelStatus,
  type RealtimePayload,
  type RealtimeSubscription,
  assertNoError,
  subscribeToTable,
  supabase,
} from '@shared/services';
import { type Currency, type CurrencyRate } from '@shared/types';

import { USD_CODE } from './constants';
import { mockExchangeRates } from './store';
import { type CurrencyCode } from './types';

let currencyListCache: Currency[] | null = null;

/**
 * Returns all supported currencies ordered by code.
 */
async function listCurrencies(): Promise<Currency[]> {
  if (currencyListCache) return currencyListCache;

  const { data, error } = await supabase
    .from('currency')
    .select('*')
    .order('code', { ascending: true });

  assertNoError(error);

  currencyListCache = data ?? [];

  return currencyListCache;
}

/**
 * Returns the latest USD → targetCurrency exchange rate.
 *
 * displayAmount = priceUsd * rate.
 */
async function getRate(targetCurrency: CurrencyCode): Promise<number> {
  if (targetCurrency === USD_CODE) return 1;

  const { data, error } = await supabase
    .from('currency_rate')
    .select('rate')
    .eq('base', USD_CODE)
    .eq('target', targetCurrency)
    .order('fetched_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn(
      `[currencyService.getRate] DB error for ${targetCurrency}, using mock fallback:`,
      error.message,
    );
  }

  if (data) return data.rate;

  return mockExchangeRates[targetCurrency] ?? 1;
}

/**
 * Subscribes to all changes on the currency rate table.
 *
 * @param onChange - Called for every INSERT / UPDATE / DELETE on currency rate.
 * @param onError  - Optional handler for subscription-level errors.
 */
function subscribeToRates(
  onChange: (payload: RealtimePayload<CurrencyRate>) => void,
  onError?: (error: Error, status: ChannelStatus) => void,
): RealtimeSubscription {
  return subscribeToTable<CurrencyRate>(
    { channel: 'currency-rates', table: 'currency_rate' },
    onChange,
    onError,
  );
}

export const currencyService = {
  listCurrencies,
  getRate,
  subscribeToRates,
};
