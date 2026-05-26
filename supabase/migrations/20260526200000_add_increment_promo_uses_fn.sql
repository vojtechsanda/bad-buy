-- =============================================================================
-- Atomic promo code usage increment
-- =============================================================================
-- Used by the redeem-code Edge Function to avoid read-modify-write races when
-- multiple users redeem the same seed code concurrently.
-- =============================================================================

CREATE OR REPLACE FUNCTION increment_promo_uses(p_promo_code_id uuid)
RETURNS void
LANGUAGE sql
AS $$
  UPDATE promo_code SET current_uses = current_uses + 1 WHERE id = p_promo_code_id;
$$;
