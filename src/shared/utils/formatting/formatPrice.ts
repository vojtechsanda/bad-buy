import { CurrencyCode } from '@features/currency/types';
import { decimalPlacePrecision } from '@shared/constants';

export function formatPrice(price: number | string, currency: CurrencyCode) {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  return `${currency} ${numericPrice.toFixed(decimalPlacePrecision)}`;
}
