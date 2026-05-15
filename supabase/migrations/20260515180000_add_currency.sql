-- =============================================================================
-- Currency table + FK references on existing tables
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Currency table
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS currency (
  code    text  PRIMARY KEY,       -- ISO 4217 (e.g. 'USD', 'EUR')
  name    text  NOT NULL UNIQUE,   -- e.g. 'Euro'
  symbol  text  NOT NULL           -- e.g. '€' (not unique — '$' covers USD, CAD, AUD …)
);

-- -----------------------------------------------------------------------------
-- 2. RLS — public read-only reference data (same pattern as predefined_hobby)
-- -----------------------------------------------------------------------------

ALTER TABLE currency ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS currency_select_public ON currency;
CREATE POLICY currency_select_public ON currency
  FOR SELECT TO anon, authenticated
  USING (true);

-- -----------------------------------------------------------------------------
-- 3. Add FK constraints to tables that stored currency as plain text
-- -----------------------------------------------------------------------------

ALTER TABLE account
  ADD CONSTRAINT fk_account_display_currency
    FOREIGN KEY (display_currency) REFERENCES currency(code),
  ADD CONSTRAINT fk_account_wage_currency
    FOREIGN KEY (wage_currency)    REFERENCES currency(code);

ALTER TABLE tracked_item
  ADD CONSTRAINT fk_tracked_item_price_currency
    FOREIGN KEY (price_currency) REFERENCES currency(code);

ALTER TABLE currency_rate
  ADD CONSTRAINT fk_currency_rate_base
    FOREIGN KEY (base)   REFERENCES currency(code),
  ADD CONSTRAINT fk_currency_rate_target
    FOREIGN KEY (target) REFERENCES currency(code);
    