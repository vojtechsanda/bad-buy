import { CurrencyCode } from '@features/currency/types';
import { decimalPlacePrecision } from '@shared/constants';

export function formatPrice(price: number, currency: CurrencyCode) {
  return `${currency} ${price.toFixed(decimalPlacePrecision)}`;
}
