-- =============================================================================
-- Schedule pg_cron job: sync-currency-rates (daily at 04:00 UTC)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Fail fast if required secrets are not configured in Vault.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM vault.decrypted_secrets WHERE name = 'project_url') THEN
    RAISE EXCEPTION 'Missing Vault secret: project_url';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM vault.decrypted_secrets WHERE name = 'cron_secret') THEN
    RAISE EXCEPTION 'Missing Vault secret: cron_secret';
  END IF;
END;
$$;

-- Unschedule first so the migration is safe to re-apply.
SELECT cron.unschedule(jobid)
FROM   cron.job
WHERE  jobname = 'sync-currency-rates-daily';

SELECT cron.schedule(
  'sync-currency-rates-daily',
  '0 4 * * *',
  $$
  SELECT net.http_post(
    url     := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url')
              || '/functions/v1/sync-currency-rates',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'x-cron-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret')
    ),
    body    := '{}'::jsonb
  );
  $$
);
