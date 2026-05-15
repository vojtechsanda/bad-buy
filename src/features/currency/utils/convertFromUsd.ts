import { mockExchangeRates } from '../store';

export function convertFromUsd(amount: number, toCurrency: string): number {
  const rate = mockExchangeRates[toCurrency] ?? 0;

  return amount / rate;
}
