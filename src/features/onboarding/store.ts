import { Country } from '@shared/components';
import { mockCountryToCurrency } from '@shared/modules/currency';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import countries_i18n from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

countries_i18n.registerLocale(en);

const getCountryName = (iso2: string) => countries_i18n.getName(iso2, 'en') ?? iso2;

const allIso2: string[] = (() => {
  try {
    return (Intl as typeof Intl & { supportedValuesOf(key: string): string[] }).supportedValuesOf(
      'region',
    );
  } catch {
    return Object.keys(mockCountryToCurrency);
  }
})();

export const mockCountries: Country[] = allIso2
  .map((iso2) => ({ iso2, name: getCountryName(iso2), flag: getUnicodeFlagIcon(iso2) }))
  .sort((a, b) => a.name.localeCompare(b.name));
