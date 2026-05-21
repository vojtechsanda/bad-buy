import {
  type ChannelStatus,
  type RealtimePayload,
  type RealtimeSubscription,
  subscribeToTable,
} from '@shared/services';
import { type ReferralRedemption } from '@shared/types';

const MOCK_PREMIUM_EXPIRES_AT = '2026-12-31T23:59:59.999Z';

export type RedeemCodeErrorCode =
  | 'not_found'
  | 'max_uses_reached'
  | 'self_referral'
  | 'already_redeemed'
  | 'unknown';

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

  // TODO: replace with redeem-code edge function call

  return { premium_expires_at: MOCK_PREMIUM_EXPIRES_AT };
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
