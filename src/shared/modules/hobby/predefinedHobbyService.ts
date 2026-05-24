import {
  type ChannelStatus,
  type RealtimePayload,
  type RealtimeSubscription,
  subscribeToTable,
} from '@shared/services/realtime';
import { supabase } from '@shared/services/supabase';
import { PredefinedHobby } from '@shared/types';
import { assertNoError } from '@shared/utils/errors';

/**
 * Returns all predefined hobbies, sorted by category and sort_order.
 */
async function list(): Promise<PredefinedHobby[]> {
  const { data, error } = await supabase
    .from('predefined_hobby')
    .select('*')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true });

  assertNoError(error);

  return data ?? [];
}

/**
 * Returns all predefined hobbies grouped by category.
 * Categories are sorted alphabetically; hobbies within each category preserve sort_order.
 */
async function listGroupedByCategory(): Promise<Record<string, PredefinedHobby[]>> {
  const rows = await list();

  return rows.reduce<Record<string, PredefinedHobby[]>>((acc, hobby) => {
    (acc[hobby.category] ??= []).push(hobby);

    return acc;
  }, {});
}

/**
 * Subscribes to any row changes on the predefined_hobby table.
 *
 * @param onError - Optional handler for subscription-level errors.
 */
function subscribe(
  onChange: (payload: RealtimePayload<PredefinedHobby>) => void,
  onError?: (error: Error, status: ChannelStatus) => void,
): RealtimeSubscription {
  return subscribeToTable<PredefinedHobby>(
    { channel: 'predefined-hobby', table: 'predefined_hobby' },
    onChange,
    onError,
  );
}

export const predefinedHobbyService = {
  list,
  listGroupedByCategory,
  subscribe,
};
