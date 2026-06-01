import { authService } from '@features/auth';
import {
  type ChannelStatus,
  type RealtimePayload,
  type RealtimeSubscription,
  subscribeToTable,
  supabase,
} from '@shared/services';
import {
  type TablesInsert,
  type TablesUpdate,
  type TrackedItem,
  type TrackedItemStatus,
  type TrackedItemSuggestion,
} from '@shared/types';
import { assertNoError, unwrapRow } from '@shared/utils';

import { pushNotificationService } from './pushNotificationService';

export type SuggestionInput = {
  name: string;
  item_emoji?: string | null;
  price_usd: number;
};

export type FreezeInput = {
  name: string;
  item_emoji?: string | null;
  price_usd: number;
  price_currency: string;
  conversion_rate_snapshot: number;
  freeze_until: string;
  suggestions?: SuggestionInput[];
  notificationsEnabled?: boolean;
};

export type RefreezeInput = {
  freeze_until: string;
  name?: string;
  item_emoji?: string | null;
  notificationsEnabled?: boolean;
};

/**
 * Fields required when recording a brand-new skip/buy from the audit screen.
 */
export type NewDecisionInput = {
  price_usd: number;
  price_currency: string;
  conversion_rate_snapshot: number;
  suggestions?: SuggestionInput[];
};

export type FinalDecisionStatus = Extract<TrackedItemStatus, 'skipped' | 'bought'>;

async function insertSuggestions(
  trackedItemId: string,
  suggestions: SuggestionInput[],
): Promise<void> {
  if (suggestions.length === 0) return;

  const rows: TablesInsert<'tracked_item_suggestion'>[] = suggestions.map((s) => ({
    tracked_item_id: trackedItemId,
    name: s.name,
    item_emoji: s.item_emoji ?? null,
    price_usd: s.price_usd,
  }));

  const { error } = await supabase.from('tracked_item_suggestion').insert(rows);

  assertNoError(error);
}

async function insertItem(row: TablesInsert<'tracked_item'>): Promise<TrackedItem> {
  const { data, error } = await supabase.from('tracked_item').insert(row).select().single();

  return unwrapRow(data, error, 'trackedItemService.insertItem');
}

async function updateItem(
  id: string,
  patch: TablesUpdate<'tracked_item'>,
  caller: string,
): Promise<TrackedItem> {
  const { data, error } = await supabase
    .from('tracked_item')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  return unwrapRow(data, error, caller);
}

/**
 * Creates a new frozen tracked item and schedules its push notification.
 */
async function freeze(input: FreezeInput): Promise<TrackedItem> {
  const accountId = await authService.getCurrentUserId();

  const row: TablesInsert<'tracked_item'> = {
    account_id: accountId,
    name: input.name,
    item_emoji: input.item_emoji ?? null,
    price_usd: input.price_usd,
    price_currency: input.price_currency,
    conversion_rate_snapshot: input.conversion_rate_snapshot,
    status: 'frozen',
    freeze_until: input.freeze_until,
    frozen_at: new Date().toISOString(),
  };

  const item = await insertItem(row);

  await Promise.all([
    input.notificationsEnabled !== false
      ? pushNotificationService.scheduleFreezeNotification(item.id, item.freeze_until!)
      : Promise.resolve(),
    insertSuggestions(item.id, input.suggestions ?? []),
  ]);

  return item;
}

/**
 * Re-freezes an existing tracked item with a new expiry.
 */
async function refreeze(id: string, input: RefreezeInput): Promise<TrackedItem> {
  const patch: TablesUpdate<'tracked_item'> = {
    freeze_until: input.freeze_until,
    frozen_at: new Date().toISOString(),
    ...(input.name !== undefined && { name: input.name }),
    ...(input.item_emoji !== undefined && { item_emoji: input.item_emoji }),
  };

  const item = await updateItem(id, patch, 'trackedItemService.refreeze');

  await pushNotificationService.cancelFreezeNotification(id);
  if (input.notificationsEnabled !== false) {
    await pushNotificationService.scheduleFreezeNotification(item.id, item.freeze_until!);
  }

  return item;
}

/**
 * Records a skip or buy decision from a new audit session.
 * decision_count on the account is incremented via a DB trigger.
 */
async function recordDecision(
  input: NewDecisionInput,
  status: FinalDecisionStatus,
): Promise<TrackedItem> {
  const accountId = await authService.getCurrentUserId();

  const row: TablesInsert<'tracked_item'> = {
    account_id: accountId,
    price_usd: input.price_usd,
    price_currency: input.price_currency,
    conversion_rate_snapshot: input.conversion_rate_snapshot,
    status,
    decided_at: new Date().toISOString(),
  };

  const item = await insertItem(row);
  await insertSuggestions(item.id, input.suggestions ?? []);

  return item;
}

/**
 * Resolves the final decision (skip or buy) on an existing frozen item.
 * Cancels any scheduled push notification for the item.
 * decision_count on the account is incremented via a DB trigger.
 */
async function decide(id: string, status: FinalDecisionStatus): Promise<TrackedItem> {
  const patch: TablesUpdate<'tracked_item'> = {
    status,
    decided_at: new Date().toISOString(),
  };

  const item = await updateItem(id, patch, 'trackedItemService.decide');
  await pushNotificationService.cancelFreezeNotification(id);

  return item;
}

/**
 * Returns all frozen tracked items for the current user, ordered by freeze_until
 * ascending so items closest to expiry (or already thawed) are at the top.
 */
async function listFrozen(): Promise<TrackedItem[]> {
  const accountId = await authService.getCurrentUserId();

  const { data, error } = await supabase
    .from('tracked_item')
    .select('*')
    .eq('account_id', accountId)
    .eq('status', 'frozen')
    .order('freeze_until', { ascending: true });

  assertNoError(error);

  return data ?? [];
}

/**
 * Returns all tracked items for the current user, ordered by created_at
 * ascending so newest items are at the top.
 */
async function list(): Promise<TrackedItem[]> {
  const accountId = await authService.getCurrentUserId();

  const { data, error } = await supabase
    .from('tracked_item')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: true });

  assertNoError(error);

  return data ?? [];
}

/**
 * Returns a single tracked item by id.
 */
async function getById(id: string): Promise<TrackedItem> {
  const { data, error } = await supabase.from('tracked_item').select('*').eq('id', id).single();

  return unwrapRow(data, error, 'trackedItemService.getById');
}

/**
 * Opens a Realtime subscription on all tracked items for the current user.
 *
 * @param onChange - Called for every INSERT / UPDATE / DELETE event on the user's items.
 * @param onError  - Optional handler for subscription-level errors (auth expiry, network drop).
 */
async function subscribe(
  onChange: (payload: RealtimePayload<TrackedItem>) => void,
  onError?: (error: Error, status: ChannelStatus) => void,
): Promise<RealtimeSubscription> {
  const accountId = await authService.getCurrentUserId();

  return subscribeToTable<TrackedItem>(
    {
      channel: `tracked-item-${accountId}`,
      table: 'tracked_item',
      filter: `account_id=eq.${accountId}`,
    },
    onChange,
    onError,
  );
}

/**
 * Returns the suggestions that were stored when the tracked item was created.
 */
async function getSuggestions(id: string): Promise<TrackedItemSuggestion[]> {
  const { data, error } = await supabase
    .from('tracked_item_suggestion')
    .select('*')
    .eq('tracked_item_id', id)
    .order('created_at', { ascending: true });

  assertNoError(error);

  return data ?? [];
}

export const trackedItemService = {
  freeze,
  refreeze,
  recordDecision,
  decide,
  list,
  listFrozen,
  getById,
  getSuggestions,
  subscribe,
};
