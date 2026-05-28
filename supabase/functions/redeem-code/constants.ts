/** SQLSTATE for application-level errors raised by the redeem_code SQL function. */
export const SQLSTATE_APP_ERROR = 'P0001';

/** Maps redeem_code error tokens to HTTP status codes. */
export const APP_ERROR_STATUS: Record<string, number> = {
  account_not_found: 404,
  self_referral: 400,
  already_redeemed: 400,
  code_not_found: 400,
  code_exhausted: 400,
};
