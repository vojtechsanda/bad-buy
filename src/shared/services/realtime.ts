import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { supabase } from './supabase';

export type RealtimePayload<T extends Record<string, unknown>> = RealtimePostgresChangesPayload<T>;

export type RealtimeSubscription = {
  unsubscribe: () => void;
};

export type SubscribeOptions = {
  channel: string;
  table: string;
  schema?: string;
  filter?: string;
};

export type ChannelStatus = 'SUBSCRIBED' | 'CHANNEL_ERROR' | 'TIMED_OUT' | 'CLOSED';

const DEFAULT_SCHEMA = 'public';

/**
 * Subscribes to row changes on a Supabase table.
 *
 * @param options   - Channel name, table, optional schema and row filter.
 * @param onChange  - Called for every INSERT / UPDATE / DELETE event.
 * @param onError   - Called when the channel enters an unrecoverable state
 *                    (CHANNEL_ERROR, TIMED_OUT, or unexpectedly CLOSED).
 */
export function subscribeToTable<T extends Record<string, unknown>>(
  options: SubscribeOptions,
  onChange: (payload: RealtimePayload<T>) => void,
  onError?: (error: Error, status: ChannelStatus) => void,
): RealtimeSubscription {
  const { channel: channelName, table, schema = DEFAULT_SCHEMA, filter } = options;

  let isUnsubscribing = false;

  const channel: RealtimeChannel = supabase
    .channel(channelName)
    .on<T>('postgres_changes', { event: '*', schema, table, filter }, onChange)
    .subscribe((status, err) => {
      const errorStatus = status as ChannelStatus;
      const isErrorStatus =
        errorStatus === 'CHANNEL_ERROR' ||
        errorStatus === 'TIMED_OUT' ||
        (errorStatus === 'CLOSED' && !isUnsubscribing);

      if (onError && isErrorStatus) {
        onError(err ?? new Error(`Realtime channel entered status: ${status}`), errorStatus);
      }
    });

  return {
    unsubscribe: () => {
      isUnsubscribing = true;
      supabase.removeChannel(channel).catch((err: unknown) => {
        console.error('[subscribeToTable] Failed to remove channel:', channelName, err);
      });
    },
  };
}
