-- =============================================================================
-- Drop UNIQUE constraint on currency.name
-- =============================================================================

ALTER TABLE currency DROP CONSTRAINT IF EXISTS currency_name_key;
