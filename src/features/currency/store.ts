import { CurrencyRate } from '@shared/types';

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

type MockCurrencyRate = CurrencyRate & {
  name: string;
};

export const mockAvailableCurrencies: MockCurrencyRate[] = [
  {
    id: 'cr-czk',
    base: 'USD',
    target: 'CZK',
    rate: 0.044,
    fetched_at: '2026-05-15T00:00:00Z',
    name: 'Czech Koruna',
  },
  {
    id: 'cr-eur',
    base: 'USD',
    target: 'EUR',
    rate: 1.08,
    fetched_at: '2026-05-15T00:00:00Z',
    name: 'Euro',
  },
  {
    id: 'cr-usd',
    base: 'USD',
    target: 'USD',
    rate: 1,
    fetched_at: '2026-05-15T00:00:00Z',
    name: 'US Dollar',
  },
  {
    id: 'cr-gbp',
    base: 'USD',
    target: 'GBP',
    rate: 1.27,
    fetched_at: '2026-05-15T00:00:00Z',
    name: 'British Pound',
  },
  {
    id: 'cr-pln',
    base: 'USD',
    target: 'PLN',
    rate: 0.25,
    fetched_at: '2026-05-15T00:00:00Z',
    name: 'Polish Zloty',
  },
  {
    id: 'cr-chf',
    base: 'USD',
    target: 'CHF',
    rate: 1.13,
    fetched_at: '2026-05-15T00:00:00Z',
    name: 'Swiss Franc',
  },
  {
    id: 'cr-huf',
    base: 'USD',
    target: 'HUF',
    rate: 0.0028,
    fetched_at: '2026-05-15T00:00:00Z',
    name: 'Hungarian Forint',
  },
  {
    id: 'cr-jpy',
    base: 'USD',
    target: 'JPY',
    rate: 0.0066,
    fetched_at: '2026-05-15T00:00:00Z',
    name: 'Japanese Yen',
  },
  {
    id: 'cr-cad',
    base: 'USD',
    target: 'CAD',
    rate: 0.74,
    fetched_at: '2026-05-15T00:00:00Z',
    name: 'Canadian Dollar',
  },
  {
    id: 'cr-aud',
    base: 'USD',
    target: 'AUD',
    rate: 0.65,
    fetched_at: '2026-05-15T00:00:00Z',
    name: 'Australian Dollar',
  },
];
