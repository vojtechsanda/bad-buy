import { mockCountryToCurrency } from '../store';

export const getCurrencyForCountry = (iso2: string): string =>
  mockCountryToCurrency[iso2.toUpperCase()] ?? 'USD';
