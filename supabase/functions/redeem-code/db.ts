import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.105.1';

// =============================================================================
// Types
// =============================================================================

export type AccountRow = {
  referral_code: string;
  premium_expires_at: string | null;
};

export type PromoCodeRow = {
  id: string;
  premium_months_granted: number;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  expires_at: string | null;
};

export type ReferrerRow = {
  id: string;
  premium_expires_at: string | null;
};

export type RedemptionRow = {
  redeemer_account_id: string;
  referrer_account_id: string | null;
  promo_code_id: string | null;
  premium_months_granted: number;
};

// =============================================================================
// Queries
// =============================================================================

export async function fetchAccount(supabase: SupabaseClient, userId: string) {
  return supabase
    .from('account')
    .select('referral_code, premium_expires_at')
    .eq('id', userId)
    .single<AccountRow>();
}

export async function checkAlreadyRedeemed(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from('referral_redemption')
    .select('id')
    .eq('redeemer_account_id', userId)
    .maybeSingle();
  return data !== null;
}

export async function fetchPromoCode(supabase: SupabaseClient, code: string) {
  return supabase
    .from('promo_code')
    .select('id, premium_months_granted, max_uses, current_uses, is_active, expires_at')
    .eq('code', code)
    .maybeSingle<PromoCodeRow>();
}

export async function fetchReferrer(supabase: SupabaseClient, referralCode: string) {
  return supabase
    .from('account')
    .select('id, premium_expires_at')
    .eq('referral_code', referralCode)
    .maybeSingle<ReferrerRow>();
}

// =============================================================================
// Mutations
// =============================================================================

export async function grantPremium(
  supabase: SupabaseClient,
  accountId: string,
  newExpiresAt: string,
) {
  const { error } = await supabase
    .from('account')
    .update({ premium_expires_at: newExpiresAt })
    .eq('id', accountId);
  if (error) throw error;
}

export async function incrementPromoUses(supabase: SupabaseClient, promoCodeId: string) {
  const { error } = await supabase.rpc('increment_promo_uses', {
    p_promo_code_id: promoCodeId,
  });
  if (error) throw error;
}

export async function insertRedemption(supabase: SupabaseClient, row: RedemptionRow) {
  return supabase.from('referral_redemption').insert(row);
}
