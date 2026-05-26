import { type Country } from '@shared/components';
import { type CountryRow } from '@shared/types';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';

export function buildCountryList(rows: CountryRow[]): Country[] {
  return rows
    .map((row) => ({ iso2: row.code, name: row.name, flag: getUnicodeFlagIcon(row.code) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
