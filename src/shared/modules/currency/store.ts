import type { CurrencyRate } from '@shared/types';
import { create } from 'zustand';

type ExchangeRatesState = {
  rates: CurrencyRate[];
  isLoading: boolean;
  setRates: (rates: CurrencyRate[]) => void;
  setLoading: (isLoading: boolean) => void;
};

export const useExchangeRatesStore = create<ExchangeRatesState>((set) => ({
  rates: [],
  isLoading: true,
  setRates: (rates) => set({ rates }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export function useExchangeRates() {
  const rates = useExchangeRatesStore((s) => s.rates);
  const isLoading = useExchangeRatesStore((s) => s.isLoading);

  return { rates, isLoading };
}
