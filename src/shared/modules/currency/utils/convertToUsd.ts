import { formatPrice } from '@shared/utils';

import { USD_CODE } from '../constants';
import { mockExchangeRates } from '../store';
import { CurrencyCode } from '../types';

export function convertToUsd(
  amount: number | string,
  fromCurrency: CurrencyCode,
  customRate?: number,
): number {
  // rate = 1 USD → N units of fromCurrency (matches DB currency_rate.rate convention)
  const rate = customRate !== undefined ? customRate : (mockExchangeRates[fromCurrency] ?? 1);
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  return numericAmount / rate;
}

export function convertAndFormatToUsd(
  amount: number | string,
  fromCurrency: CurrencyCode,
  customRate?: number,
): string {
  const convertedAmount = convertToUsd(amount, fromCurrency, customRate);

  return formatPrice(convertedAmount, USD_CODE);
}
