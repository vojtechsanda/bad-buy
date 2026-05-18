import { decimalPlacePrecision } from '@shared/constants';
import { CurrencyCode } from '@shared/modules/currency/types';

export function formatPrice(price: number | string, currency: CurrencyCode) {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  return `${currency} ${numericPrice.toFixed(decimalPlacePrecision)}`;
}
