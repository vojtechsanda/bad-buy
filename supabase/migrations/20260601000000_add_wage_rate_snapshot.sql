-- Add wage_rate_snapshot to account so the conversion rate used when saving the
-- hourly wage is preserved. Without it, display conversions drift whenever the
-- live exchange rate changes.

ALTER TABLE account ADD COLUMN wage_rate_snapshot NUMERIC;

-- Backfill existing rows with the most-recent available rate for each account's
-- wage_currency. Falls back to 1 (i.e. treat wage as already in USD) when no
-- rate row exists for that currency.
UPDATE account a
SET wage_rate_snapshot = COALESCE(
  (
    SELECT cr.rate
    FROM   currency_rate cr
    WHERE  cr.base   = 'USD'
      AND  cr.target = a.wage_currency
    ORDER  BY cr.fetched_at DESC
    LIMIT  1
  ),
  1
);

ALTER TABLE account ALTER COLUMN wage_rate_snapshot SET NOT NULL;
ALTER TABLE account ALTER COLUMN wage_rate_snapshot SET DEFAULT 1;
