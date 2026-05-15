import { formatPrice } from '@shared/utils';

import { USD_CODE } from '../constants';
import { mockExchangeRates } from '../store';
import { CurrencyCode } from '../types';

export function convertToUsd(amount: number | string, fromCurrency: CurrencyCode): number {
  const rate = mockExchangeRates[fromCurrency] ?? 0;
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  return numericAmount * rate;
}

export function convertAndFormatToUsd(amount: number | string, fromCurrency: CurrencyCode): string {
  const convertedAmount = convertToUsd(amount, fromCurrency);

  return formatPrice(convertedAmount, USD_CODE);
}
