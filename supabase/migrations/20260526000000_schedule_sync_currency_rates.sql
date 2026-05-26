-- =============================================================================
-- Schedule pg_cron job: sync-currency-rates (daily at 04:00 UTC)
-- =============================================================================
-- Before applying this migration, set database config vars once per environment:
--
--   ALTER DATABASE postgres SET app.settings.supabase_url     = 'https://<ref>.supabase.co';
--   ALTER DATABASE postgres SET app.settings.service_role_key = '<service_role_key>';
--
-- Local dev values come from `supabase status` (API URL + service_role key).
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.schedule(
  'sync-currency-rates-daily',
  '0 4 * * *',
  $$
  SELECT net.http_post(
    url     := current_setting('app.settings.supabase_url') || '/functions/v1/sync-currency-rates',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body    := '{}'::jsonb
  );
  $$
);
