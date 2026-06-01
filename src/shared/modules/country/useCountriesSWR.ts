import { getCurrencyForCountry } from '@shared/modules/currency';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { useMemo } from 'react';
import useSWR from 'swr';

import { countryService } from './countryService';

export const countriesSWRKey = 'countries';

export function useCountriesSWR() {
  const { data, error, isLoading, mutate } = useSWR(countriesSWRKey, countryService.listCountries);

  const countries = useMemo(
    () =>
      data
        ?.map((country) => ({
          iso2: country.code,
          name: country.name,
          flag: getUnicodeFlagIcon(country.code),
          currency: getCurrencyForCountry(country.code, data),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [data],
  );

  return {
    countries,
    isLoading,
    error,
    invalidateCountries: mutate,
  };
}
