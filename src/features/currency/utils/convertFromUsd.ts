import { formatPrice } from '@shared/utils';

import { mockExchangeRates } from '../store';
import { CurrencyCode } from '../types';

export function convertFromUsd(amount: number | string, toCurrency: CurrencyCode): number {
  const rate = mockExchangeRates[toCurrency] ?? 0;
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  return numericAmount / rate;
}

export function convertAndFormatFromUsd(amount: number | string, toCurrency: CurrencyCode): string {
  const convertedAmount = convertFromUsd(amount, toCurrency);

  return formatPrice(convertedAmount, toCurrency);
}
