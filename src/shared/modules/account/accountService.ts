import { authService } from '@features/auth';
import {
  type ChannelStatus,
  type RealtimePayload,
  type RealtimeSubscription,
  subscribeToTable,
  supabase,
} from '@shared/services';
import { Account, type TablesInsert } from '@shared/types';
import { SupabaseError, assertNoError, unwrapRow } from '@shared/utils';

export type CreateAccountPayload = Required<
  Pick<
    Account,
    'name' | 'birthdate' | 'country' | 'display_currency' | 'wage_currency' | 'hourly_wage_usd'
  >
> &
  Partial<Pick<Account, 'work_hours_per_day'>>;

export type AccountUpdatePatch = Partial<
  Pick<
    Account,
    | 'name'
    | 'birthdate'
    | 'country'
    | 'display_currency'
    | 'wage_currency'
    | 'hourly_wage_usd'
    | 'work_hours_per_day'
    | 'notifications_enabled'
  >
>;

function hasDefinedValues(patch: object): boolean {
  return Object.values(patch).some((v) => v !== undefined);
}

/**
 * Returns the account for the currently authenticated user.
 */
async function get(): Promise<Account | null> {
  const userId = await authService.getCurrentUserId();

  const { data, error } = await supabase.from('account').select('*').eq('id', userId).maybeSingle();

  if (error) throw new SupabaseError(error);

  return data;
}

/**
 * Creates the account (after auth.signUp has already created the auth user).
 */
async function create(payload: CreateAccountPayload): Promise<Account> {
  const id = await authService.getCurrentUserId();

  const row: TablesInsert<'account'> = { id, ...payload };

  const { error } = await supabase.from('account').insert(row);

  assertNoError(error);

  const account = await get();

  if (!account) throw new Error('accountService.create: account row missing after insert');

  return account;
}

/**
 * Updates account fields for the authenticated user's account.
 */
async function update(patch: AccountUpdatePatch): Promise<Account> {
  if (!hasDefinedValues(patch)) {
    const existing = await get();
    if (!existing) throw new Error('accountService.update: no account row found');

    return existing;
  }

  const userId = await authService.getCurrentUserId();

  const { data, error } = await supabase
    .from('account')
    .update(patch)
    .eq('id', userId)
    .select()
    .single();

  return unwrapRow(data, error, 'accountService.update');
}

/**
 * Deletes the account row for the currently authenticated user.
 *
 * TODO: replace with a delete-account Edge Function call that uses the service role.
 */
async function deleteAccount(): Promise<void> {
  const userId = await authService.getCurrentUserId();

  const { error } = await supabase.from('account').delete().eq('id', userId);
  assertNoError(error);

  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) {
    throw new Error(`accountService.deleteAccount: signOut failed — ${signOutError.message}`);
  }
}

/**
 * Opens a Realtime subscription on the authenticated user's account row.
 * The account id is resolved from the current auth session.
 *
 * @param onChange - Called with the realtime payload on any row change.
 * @param onError  - Optional handler for subscription-level errors.
 */
async function subscribe(
  onChange: (payload: RealtimePayload<Account>) => void,
  onError?: (error: Error, status: ChannelStatus) => void,
): Promise<RealtimeSubscription> {
  const accountId = await authService.getCurrentUserId();

  return subscribeToTable<Account>(
    {
      channel: `account-${accountId}`,
      table: 'account',
      filter: `id=eq.${accountId}`,
    },
    onChange,
    onError,
  );
}

export const accountService = {
  get,
  create,
  update,
  deleteAccount,
  subscribe,
};
