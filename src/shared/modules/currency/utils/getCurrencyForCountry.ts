import { type CountryRow } from '@shared/types';

import { USD_CODE } from '../constants';

export const getCurrencyForCountry = (iso2: string, countries: CountryRow[]): string =>
  countries.find((c) => c.code === iso2.toUpperCase())?.default_currency ?? USD_CODE;
