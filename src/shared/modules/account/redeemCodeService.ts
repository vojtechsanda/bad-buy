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

export const redeemCodeService = {
  redeemCode,
};
