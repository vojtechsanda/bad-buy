import { authService } from '@features/auth';
import {
  type ChannelStatus,
  type RealtimePayload,
  type RealtimeSubscription,
  assertNoError,
  subscribeToTable,
  supabase,
  unwrapRow,
} from '@shared/services';
import { type AccountHobby, type TablesInsert } from '@shared/types';

/**
 * Returns all hobbies for the currently authenticated user, ordered by creation time.
 */
async function list(): Promise<AccountHobby[]> {
  const accountId = await authService.getCurrentUserId();

  const { data, error } = await supabase
    .from('account_hobby')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: true });

  assertNoError(error);

  return data ?? [];
}

/**
 * Adds a single predefined hobby for the current user.
 */
async function add(hobbyId: string): Promise<AccountHobby> {
  const accountId = await authService.getCurrentUserId();

  const { data: predefinedHobbyRow, error: fetchError } = await supabase
    .from('predefined_hobby')
    .select('id, name')
    .eq('id', hobbyId)
    .single();

  const predefinedHobby = unwrapRow(predefinedHobbyRow, fetchError, 'hobbyService.add');

  const row: TablesInsert<'account_hobby'> = {
    account_id: accountId,
    hobby_name: predefinedHobby.name,
    predefined_hobby_id: predefinedHobby.id,
    is_moderated: true,
  };

  const { data, error } = await supabase.from('account_hobby').insert(row).select().single();

  return unwrapRow(data, error, 'hobbyService.add');
}

/**
 * Bulk-inserts predefined hobbies for the current user (e.g. in the onboarding).
 */
async function addMany(hobbyIds: string[]): Promise<AccountHobby[]> {
  if (hobbyIds.length === 0) return [];

  const accountId = await authService.getCurrentUserId();

  const { data: predefinedHobbies, error: fetchError } = await supabase
    .from('predefined_hobby')
    .select('id, name')
    .in('id', hobbyIds);

  assertNoError(fetchError);

  const rows: TablesInsert<'account_hobby'>[] = (predefinedHobbies ?? []).map((hobby) => ({
    account_id: accountId,
    hobby_name: hobby.name,
    predefined_hobby_id: hobby.id,
    is_moderated: true,
  }));

  const { data, error } = await supabase.from('account_hobby').insert(rows).select();

  assertNoError(error);

  return data ?? [];
}

/**
 * Removes a hobby by id.
 */
async function remove(hobbyId: string): Promise<void> {
  const { error } = await supabase.from('account_hobby').delete().eq('id', hobbyId);

  assertNoError(error);
}

/**
 * Adds a custom (free-text) hobby for the current user. Premium-only feature.
 */
async function addCustom(hobbyName: string): Promise<AccountHobby> {
  const accountId = await authService.getCurrentUserId();

  const row: TablesInsert<'account_hobby'> = {
    account_id: accountId,
    hobby_name: hobbyName.trim(),
    predefined_hobby_id: null,
    is_moderated: true, // for the v1, we will just rely on the AI prompt moderation
  };

  const { data, error } = await supabase.from('account_hobby').insert(row).select().single();

  return unwrapRow(data, error, 'hobbyService.addCustom');
}

/**
 * Opens a Realtime subscription on the current user's account_hobby rows.
 *
 * @param onChange - Called with the realtime payload on any row change.
 * @param onError  - Optional handler for subscription-level errors.
 */
async function subscribe(
  onChange: (payload: RealtimePayload<AccountHobby>) => void,
  onError?: (error: Error, status: ChannelStatus) => void,
): Promise<RealtimeSubscription> {
  const accountId = await authService.getCurrentUserId();

  return subscribeToTable<AccountHobby>(
    {
      channel: `account-hobby-${accountId}`,
      table: 'account_hobby',
      filter: `account_id=eq.${accountId}`,
    },
    onChange,
    onError,
  );
}

export const hobbyService = {
  list,
  add,
  addMany,
  remove,
  addCustom,
  subscribe,
};
