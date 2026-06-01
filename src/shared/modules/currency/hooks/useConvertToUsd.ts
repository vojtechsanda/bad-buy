import { formatPrice } from '@shared/utils';

import { USD_CODE } from '../constants';
import { useExchangeRates } from '../store';
import { CurrencyCode } from '../types';
import { getRateFromExchangeRates } from '../utils';

export function useConvertToUsd() {
  const { rates } = useExchangeRates();

  function convertToUsd(
    amount: number | string,
    fromCurrency: CurrencyCode,
    customRate?: number,
  ): number {
    const rate =
      customRate !== undefined ? customRate : getRateFromExchangeRates(rates, fromCurrency);
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    return numericAmount / rate;
  }

  function convertAndFormatToUsd(
    amount: number | string,
    fromCurrency: CurrencyCode,
    customRate?: number,
  ): string {
    const convertedAmount = convertToUsd(amount, fromCurrency, customRate);

    return formatPrice(convertedAmount, USD_CODE);
  }

  return { convertToUsd, convertAndFormatToUsd };
}
