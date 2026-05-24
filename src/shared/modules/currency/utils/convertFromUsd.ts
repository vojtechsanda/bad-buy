import { formatPrice } from '@shared/utils';

import { CurrencyCode } from '../types';

export function convertFromUsd(
  amount: number | string,
  toCurrency: CurrencyCode,
  customRate?: number,
): number {
  // rate = 1 USD = N units of target currency
  const rate = customRate !== undefined ? customRate : 1;
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  return numericAmount * rate;
}

export function convertAndFormatFromUsd(
  amount: number | string,
  toCurrency: CurrencyCode,
  customRate?: number,
): string {
  const convertedAmount = convertFromUsd(amount, toCurrency, customRate);

  return formatPrice(convertedAmount, toCurrency);
}
