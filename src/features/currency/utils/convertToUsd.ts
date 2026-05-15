import { mockExchangeRates } from '../store';

export function convertToUsd(amount: number, fromCurrency: string): number {
  const rate = mockExchangeRates[fromCurrency] ?? 0;

  return amount * rate;
}
