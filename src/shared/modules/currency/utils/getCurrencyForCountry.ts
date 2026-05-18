import { USD_CODE } from '../constants';
import { mockCountryToCurrency } from '../store';

export const getCurrencyForCountry = (iso2: string): string =>
  mockCountryToCurrency[iso2.toUpperCase()] ?? USD_CODE;
