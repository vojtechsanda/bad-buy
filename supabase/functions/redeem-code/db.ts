import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.105.1';

/**
 * Calls the redeem_code SQL function which runs the full redemption flow
 * (account fetch, validation, insert, premium grants) in one transaction.
 * -> no step can partially apply.
 */
export async function redeemCode(
  supabase: SupabaseClient,
  userId: string,
  code: string,
): Promise<string> {
  const { data, error } = await supabase.rpc('redeem_code', {
    p_user_id: userId,
    p_code: code,
  });
  if (error) throw error;

  return data as string;
}
