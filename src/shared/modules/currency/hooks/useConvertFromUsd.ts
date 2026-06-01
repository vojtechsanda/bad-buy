import { formatPrice } from '@shared/utils';

import { useExchangeRates } from '../store';
import { CurrencyCode } from '../types';
import { getRateFromExchangeRates } from '../utils';

export function useConvertFromUsd() {
  const { rates } = useExchangeRates();

  function convertFromUsd(
    amount: number | string,
    toCurrency: CurrencyCode,
    customRate?: number,
  ): number {
    const rate =
      customRate !== undefined ? customRate : (getRateFromExchangeRates(rates, toCurrency) ?? 1);
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    return numericAmount * rate;
  }

  function convertAndFormatFromUsd(
    amount: number | string,
    toCurrency: CurrencyCode,
    customRate?: number,
  ): string {
    const convertedAmount = convertFromUsd(amount, toCurrency, customRate);

    return formatPrice(convertedAmount, toCurrency);
  }

  return { convertFromUsd, convertAndFormatFromUsd };
}
