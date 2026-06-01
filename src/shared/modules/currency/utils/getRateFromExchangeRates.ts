import { CurrencyRate } from '@shared/types';

export function getRateFromExchangeRates(exchangeRates: CurrencyRate[], currency: string): number {
  // rate = 1 USD → N units of fromCurrency (matches DB currency_rate.rate convention)
  return exchangeRates.find((rate) => rate.target === currency)?.rate ?? 1;
}
