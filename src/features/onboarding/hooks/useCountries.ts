import { getCurrencyForCountry } from '@shared/modules/currency';
import { type CountryRow } from '@shared/types';
import { useEffect, useMemo, useState } from 'react';

import { countryService } from '../countryService';
import { buildCountryList } from '../utils';

export function useCountries() {
  const [countryRows, setCountryRows] = useState<CountryRow[]>([]);

  useEffect(() => {
    countryService.listCountries().then(setCountryRows);
  }, []);

  const countries = useMemo(() => buildCountryList(countryRows), [countryRows]);

  const resolveCurrency = (iso2: string) => getCurrencyForCountry(iso2, countryRows);

  return { countries, resolveCurrency };
}
