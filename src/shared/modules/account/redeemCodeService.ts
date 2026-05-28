import {
  type ChannelStatus,
  type RealtimePayload,
  type RealtimeSubscription,
  subscribeToTable,
  supabase,
} from '@shared/services';
import { type ReferralRedemption } from '@shared/types';
import { FunctionsHttpError } from '@supabase/supabase-js';

import { EDGE_ERROR_MAP, type RedeemCodeErrorCode } from './constants';

export class RedeemCodeError extends Error {
  readonly code: RedeemCodeErrorCode;
  constructor(code: RedeemCodeErrorCode, message?: string) {
    super(message ?? code);
    this.code = code;
    this.name = 'RedeemCodeError';
  }
}

export type RedeemCodeInput = {
  code: string;
};

export type RedeemCodeResponse = {
  premium_expires_at: string;
};

async function redeemCode(input: RedeemCodeInput): Promise<RedeemCodeResponse> {
  const trimmed = input.code.trim().toUpperCase();
  if (!trimmed) throw new RedeemCodeError('not_found');

  const { data, error } = await supabase.functions.invoke('redeem-code', {
    body: { code: trimmed },
  });

  if (error) {
    if (error instanceof FunctionsHttpError) {
      const body = await error.context.json().catch(() => null);
      const code = EDGE_ERROR_MAP[body?.error] ?? 'unknown';
      throw new RedeemCodeError(code, error.message);
    }
    throw new RedeemCodeError('unknown', error.message);
  }

  return { premium_expires_at: data.premium_expires_at };
}

/**
 * Subscribes to referral_redemption row changes for the given account.
 *
 * @param accountId - The authenticated user's account id (redeemer).
 * @param onError   - Optional handler for subscription-level errors.
 */
function subscribe(
  accountId: string,
  onChange: (payload: RealtimePayload<ReferralRedemption>) => void,
  onError?: (error: Error, status: ChannelStatus) => void,
): RealtimeSubscription {
  return subscribeToTable<ReferralRedemption>(
    {
      channel: `referral-redemption-${accountId}`,
      table: 'referral_redemption',
      filter: `redeemer_account_id=eq.${accountId}`,
    },
    onChange,
    onError,
  );
}

export const redeemCodeService = {
  redeemCode,
  subscribe,
};
