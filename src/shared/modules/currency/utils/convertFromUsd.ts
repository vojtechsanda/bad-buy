import { formatPrice } from '@shared/utils';

import { mockExchangeRates } from '../store';
import { CurrencyCode } from '../types';

export function convertFromUsd(
  amount: number | string,
  toCurrency: CurrencyCode,
  customRate?: number,
): number {
  const rate = customRate !== undefined ? customRate : (mockExchangeRates[toCurrency] ?? 0);
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  return numericAmount / rate;
}

export function convertAndFormatFromUsd(
  amount: number | string,
  toCurrency: CurrencyCode,
  customRate?: number,
): string {
  const convertedAmount = convertFromUsd(amount, toCurrency, customRate);

  return formatPrice(convertedAmount, toCurrency);
}
