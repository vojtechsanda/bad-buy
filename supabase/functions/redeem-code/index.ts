import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.105.1';
import { z } from 'https://esm.sh/zod@3';

import {
  checkAlreadyRedeemed,
  fetchAccount,
  fetchPromoCode,
  fetchReferrer,
  grantPremium,
  incrementPromoUses,
  insertRedemption,
} from './db.ts';

// =============================================================================
// Environment
// =============================================================================

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const SUPABASE_URL = requireEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY = requireEnv('SUPABASE_ANON_KEY');
const SUPABASE_SERVICE_ROLE_KEY = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

// =============================================================================
// HTTP helpers
// =============================================================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// =============================================================================
// Validation
// =============================================================================

const RequestBodySchema = z.object({
  code: z.string().min(1),
});

// =============================================================================
// Helpers
// =============================================================================

/** Stacks `months` of premium on top of `currentExpiry`, or starts from now if free. */
function stackPremium(currentExpiry: string | null, months: number): string {
  const base = currentExpiry ? Math.max(Date.now(), new Date(currentExpiry).getTime()) : Date.now();
  const result = new Date(base);
  result.setMonth(result.getMonth() + months);
  return result.toISOString();
}

// =============================================================================
// Request handler
// =============================================================================

async function handleRequest(req: Request): Promise<Response> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return jsonResponse({ error: 'Missing authorization' }, 401);

  // User-scoped client — used only for auth verification
  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();
  if (authError || !user) return jsonResponse({ error: 'Unauthorized' }, 401);

  const rawBody = req.headers.get('content-type')?.includes('application/json')
    ? await req.json()
    : {};
  const bodyResult = RequestBodySchema.safeParse(rawBody);
  if (!bodyResult.success) {
    return jsonResponse({ error: 'Invalid request body', detail: bodyResult.error.flatten() }, 400);
  }
  const code = bodyResult.data.code.trim().toUpperCase();

  // Service role client — required for cross-user writes (referrer premium, promo uses)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: account, error: accountError } = await fetchAccount(supabase, user.id);
  if (accountError || !account) return jsonResponse({ error: 'Account not found' }, 404);

  if (account.referral_code === code) {
    return jsonResponse({ error: 'self_referral' }, 400);
  }

  const alreadyRedeemed = await checkAlreadyRedeemed(supabase, user.id);
  if (alreadyRedeemed) return jsonResponse({ error: 'already_redeemed' }, 400);

  // Resolve code — promo codes take precedence over referral codes
  const { data: promoCode } = await fetchPromoCode(supabase, code);
  const { data: referrer } = promoCode ? { data: null } : await fetchReferrer(supabase, code);

  if (!promoCode && !referrer) {
    return jsonResponse({ error: 'code_not_found' }, 400);
  }

  if (promoCode) {
    const isExpired = promoCode.expires_at !== null && new Date(promoCode.expires_at) < new Date();
    if (!promoCode.is_active || isExpired) {
      return jsonResponse({ error: 'code_not_found' }, 400);
    }
    if (promoCode.max_uses !== null && promoCode.current_uses >= promoCode.max_uses) {
      return jsonResponse({ error: 'code_exhausted' }, 400);
    }
  }

  const premiumMonths = promoCode?.premium_months_granted ?? 3;

  // Insert redemption first — the DB unique constraint on redeemer_account_id is the
  // authoritative guard against double redemption under concurrent requests.
  const { error: redemptionError } = await insertRedemption(supabase, {
    redeemer_account_id: user.id,
    referrer_account_id: referrer?.id ?? null,
    promo_code_id: promoCode?.id ?? null,
    premium_months_granted: premiumMonths,
  });
  if (redemptionError) {
    if ((redemptionError as { code?: string }).code === '23505') {
      return jsonResponse({ error: 'already_redeemed' }, 400);
    }
    throw redemptionError;
  }

  const newRedeemerExpiry = stackPremium(account.premium_expires_at, premiumMonths);
  await grantPremium(supabase, user.id, newRedeemerExpiry);

  if (referrer) {
    const newReferrerExpiry = stackPremium(referrer.premium_expires_at, premiumMonths);
    await grantPremium(supabase, referrer.id, newReferrerExpiry);
  }

  if (promoCode) {
    await incrementPromoUses(supabase, promoCode.id);
  }

  return jsonResponse({ premium_expires_at: newRedeemerExpiry });
}

// =============================================================================
// Entry point
// =============================================================================

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    return await handleRequest(req);
  } catch (err) {
    console.error('[redeem-code]', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});
