-- =============================================================================
-- Seed three test accounts (dev/testing only — real auth users must exist)
-- User IDs match existing auth.users rows in the hosted project.
-- =============================================================================

-- Ensure the currencies used below exist (idempotent)
INSERT INTO currency (code, name, symbol) VALUES
  ('EUR', 'Euro',             '€'),
  ('CZK', 'Czech Koruna',     'Kč'),
  ('USD', 'US Dollar',        '$')
ON CONFLICT (code) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Accounts
-- -----------------------------------------------------------------------------

INSERT INTO account (id, name, birthdate, country, display_currency, wage_currency, hourly_wage_usd, work_hours_per_day, notifications_enabled, decision_count)
VALUES
  -- User 1 — Czech, cycling + coffee enthusiast
  (
    'deffe49d-ac98-4363-8199-38c9896d0760',
    'Marek Novák',
    '1995-03-12',
    'CZ',
    'CZK',
    'CZK',
    11.50,
    8,
    true,
    0
  ),
  -- User 2 — Slovak, music + gaming
  (
    'a85463bb-8617-4418-ac6f-c373f4e74875',
    'Jana Kováčová',
    '1998-07-24',
    'SK',
    'EUR',
    'EUR',
    9.80,
    8,
    true,
    0
  ),
  -- User 3 — German, photography + running
  (
    'f5798064-a78f-4fd0-a61f-d9abb181f8c2',
    'Felix Bauer',
    '1993-11-05',
    'DE',
    'EUR',
    'EUR',
    18.00,
    8,
    true,
    0
  )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Hobbies (is_moderated = true so generate-suggestions will pick them up)
-- -----------------------------------------------------------------------------

INSERT INTO account_hobby (account_id, hobby_name, is_moderated)
VALUES
  ('deffe49d-ac98-4363-8199-38c9896d0760', 'Cycling',     true),
  ('deffe49d-ac98-4363-8199-38c9896d0760', 'Coffee',      true),
  ('a85463bb-8617-4418-ac6f-c373f4e74875', 'Guitar',      true),
  ('a85463bb-8617-4418-ac6f-c373f4e74875', 'Gaming',      true),
  ('f5798064-a78f-4fd0-a61f-d9abb181f8c2', 'Photography', true),
  ('f5798064-a78f-4fd0-a61f-d9abb181f8c2', 'Running',     true)
ON CONFLICT (account_id, hobby_name) DO NOTHING;
