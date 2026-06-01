import useSWR from 'swr';

import { currencyService } from './currencyService';

export const currenciesSWRKey = 'currencies';

export function useCurrenciesSWR() {
  const { data, error, isLoading, mutate } = useSWR(
    currenciesSWRKey,
    currencyService.listCurrencies,
  );

  return {
    currencies: data,
    isLoading,
    error,
    invalidateCurrencies: mutate,
  };
}
