-- =============================================================================
-- Drop UNIQUE constraint on currency.name
-- =============================================================================
-- Real-world currency data (e.g. fawazahmed0) contains multiple ISO codes with
-- the same name (old/new codes for the same country — e.g. BYR and BYN are both
-- "Belarusian Ruble"). The UNIQUE constraint on name is unnecessary and prevents
-- the sync-currency-rates function from upserting the full API response.
-- =============================================================================

ALTER TABLE currency DROP CONSTRAINT IF EXISTS currency_name_key;
