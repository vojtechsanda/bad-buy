-- Both trigger functions must run as the definer role so their internal
-- SELECTs/UPDATEs on RLS-protected tables see all rows.
-- search_path is locked to '' to prevent search-path injection;
-- all table references are fully qualified (public.*).

CREATE OR REPLACE FUNCTION trg_account_before_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  candidate text;
  attempts  integer := 0;
BEGIN
  IF NEW.avatar_seed IS NULL THEN
    NEW.avatar_seed := NEW.id::text;
  END IF;

  LOOP
    candidate := upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.account WHERE referral_code = candidate);
    attempts := attempts + 1;
    IF attempts > 10 THEN
      RAISE EXCEPTION 'Could not generate unique referral_code after 10 attempts';
    END IF;
  END LOOP;
  NEW.referral_code := candidate;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION trg_tracked_item_decision_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status IN ('bought', 'skipped') THEN
    UPDATE public.account SET decision_count = decision_count + 1 WHERE id = NEW.account_id;

  ELSIF TG_OP = 'UPDATE'
    AND OLD.status = 'frozen'
    AND NEW.status IN ('bought', 'skipped') THEN
    UPDATE public.account SET decision_count = decision_count + 1 WHERE id = NEW.account_id;
  END IF;

  RETURN NEW;
END;
$$;
