
INSERT INTO public.promo_code (
  code,
  premium_months_granted,
  max_uses,
  is_active,
  expires_at
) VALUES
  ('LAUNCH2026', 3, NULL, true, TIMESTAMPTZ '2026-12-31 23:59:59+00')
ON CONFLICT (code) DO NOTHING;
