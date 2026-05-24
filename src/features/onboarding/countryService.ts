import {
  type ChannelStatus,
  type RealtimePayload,
  type RealtimeSubscription,
  assertNoError,
  subscribeToTable,
  supabase,
} from '@shared/services';
import { type CountryRow } from '@shared/types';

let countryListCache: CountryRow[] | null = null;

/**
 * Returns all countries ordered by name, each carrying its default currency
 * code.
 */
async function listCountries(): Promise<CountryRow[]> {
  if (countryListCache) return countryListCache;

  const { data, error } = await supabase
    .from('country')
    .select('*')
    .order('name', { ascending: true });

  assertNoError(error);

  countryListCache = data ?? [];

  return countryListCache;
}

/**
 * Subscribes to all changes on the country table.
 *
 * @param onChange - Called for every INSERT / UPDATE / DELETE on country.
 * @param onError  - Optional handler for subscription-level errors.
 */
function subscribeToCountries(
  onChange: (payload: RealtimePayload<CountryRow>) => void,
  onError?: (error: Error, status: ChannelStatus) => void,
): RealtimeSubscription {
  return subscribeToTable<CountryRow>(
    { channel: 'countries', table: 'country' },
    onChange,
    onError,
  );
}

export const countryService = {
  listCountries,
  subscribeToCountries,
};
