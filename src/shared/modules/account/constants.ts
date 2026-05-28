export type RedeemCodeErrorCode =
  | 'not_found'
  | 'max_uses_reached'
  | 'self_referral'
  | 'already_redeemed'
  | 'unknown';

export const EDGE_ERROR_MAP: Record<string, RedeemCodeErrorCode> = {
  code_not_found: 'not_found',
  code_exhausted: 'max_uses_reached',
  self_referral: 'self_referral',
  already_redeemed: 'already_redeemed',
};
