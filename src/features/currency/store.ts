import { Currency } from '@shared/types';

import { CurrencyCode } from './types';

export const mockExchangeRates: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  CZK: 0.044,
  PLN: 0.25,
  CHF: 1.13,
  HUF: 0.0028,
  JPY: 0.0066,
  CAD: 0.74,
  AUD: 0.65,
};

export const mockAvailableCurrencies: Currency[] = [
  {
    code: 'CZK',
    name: 'Czech Koruna',
    symbol: 'Kč',
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
  },
  {
    code: 'PLN',
    name: 'Polish Zloty',
    symbol: 'zł',
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
  },
  {
    code: 'HUF',
    name: 'Hungarian Forint',
    symbol: 'Ft',
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
  },
];
