-- =============================================================================
-- Transactional code redemption
-- =============================================================================
-- Runs the entire redemption flow (validation → insert → premium grants)
-- in one transaction so no step can partially apply.
--
-- Application-level errors are raised with ERRCODE P0001; the message is one
-- of the known error tokens the Edge Function maps to HTTP responses:
--   account_not_found (404) | self_referral | already_redeemed |
--   code_not_found | code_exhausted  (all 400)
-- =============================================================================

CREATE OR REPLACE FUNCTION redeem_code(p_user_id uuid, p_code text)
RETURNS timestamptz
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_referral_code text;
  v_promo_id           uuid;
  v_promo_months       int;
  v_promo_is_active    boolean;
  v_promo_expires_at   timestamptz;
  v_referrer_id        uuid := NULL;
  v_premium_months     int;
  v_new_expiry         timestamptz;
BEGIN
  -- Lock the redeemer's account row for the transaction duration to serialise
  -- concurrent calls for the same user ahead of the already_redeemed check.
  SELECT referral_code
    INTO v_user_referral_code
    FROM account
   WHERE id = p_user_id
     FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'account_not_found' USING ERRCODE = 'P0001';
  END IF;

  -- Self-referral check
  IF v_user_referral_code = p_code THEN
    RAISE EXCEPTION 'self_referral' USING ERRCODE = 'P0001';
  END IF;

  -- Already redeemed check
  IF EXISTS (SELECT 1 FROM referral_redemption WHERE redeemer_account_id = p_user_id) THEN
    RAISE EXCEPTION 'already_redeemed' USING ERRCODE = 'P0001';
  END IF;

  -- Resolve code — promo codes take precedence over referral codes
  SELECT id, premium_months_granted, is_active, expires_at
    INTO v_promo_id, v_promo_months, v_promo_is_active, v_promo_expires_at
    FROM promo_code
   WHERE code = p_code;

  IF FOUND THEN
    IF NOT v_promo_is_active
       OR (v_promo_expires_at IS NOT NULL AND v_promo_expires_at < NOW()) THEN
      RAISE EXCEPTION 'code_not_found' USING ERRCODE = 'P0001';
    END IF;

    -- Atomic increment-and-check: only succeeds if max_uses is not yet reached.
    -- Runs before the redemption insert so an exhausted code is rejected before
    -- any writes are committed.
    UPDATE promo_code
       SET current_uses = current_uses + 1
     WHERE id = v_promo_id
       AND (max_uses IS NULL OR current_uses < max_uses);

    IF NOT FOUND THEN
      RAISE EXCEPTION 'code_exhausted' USING ERRCODE = 'P0001';
    END IF;

    v_premium_months := v_promo_months;
  ELSE
    -- Referral code path — v_referrer_id stays NULL on the promo path above
    SELECT id INTO v_referrer_id FROM account WHERE referral_code = p_code;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'code_not_found' USING ERRCODE = 'P0001';
    END IF;
    v_premium_months := 3;
  END IF;

  -- Insert redemption; the unique constraint on redeemer_account_id is the
  -- authoritative guard against concurrent double redemption.
  BEGIN
    INSERT INTO referral_redemption
      (redeemer_account_id, referrer_account_id, promo_code_id, premium_months_granted)
    VALUES
      (p_user_id, v_referrer_id, v_promo_id, v_premium_months);
  EXCEPTION
    WHEN unique_violation THEN
      RAISE EXCEPTION 'already_redeemed' USING ERRCODE = 'P0001';
  END;

  -- Grant premium to redeemer.
  -- COALESCE is intentional: GREATEST returns NULL if any argument is NULL.
  UPDATE account
     SET premium_expires_at =
           GREATEST(NOW(), COALESCE(premium_expires_at, NOW()))
           + (v_premium_months || ' months')::interval
   WHERE id = p_user_id
   RETURNING premium_expires_at INTO v_new_expiry;

  -- Grant premium to referrer (referral code path only)
  IF v_referrer_id IS NOT NULL THEN
    UPDATE account
       SET premium_expires_at =
             GREATEST(NOW(), COALESCE(premium_expires_at, NOW()))
             + (v_premium_months || ' months')::interval
     WHERE id = v_referrer_id;
  END IF;

  RETURN v_new_expiry;
END;
$$;

-- Restrict to service_role only — must only be called via the Edge Function,
-- never directly by anon/authenticated PostgREST clients.
REVOKE EXECUTE ON FUNCTION redeem_code(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION redeem_code(uuid, text) TO service_role;
