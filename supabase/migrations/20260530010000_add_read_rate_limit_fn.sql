-- Read-only counterpart to increment_suggestion_rate_limit.
-- Returns current counts without modifying them so that index.ts can peek at
-- limits before deciding to call Gemini, and only increment afterwards.
CREATE OR REPLACE FUNCTION read_suggestion_rate_limit(
  p_window_keys text[]
)
RETURNS TABLE (out_window_key text, out_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  RETURN QUERY
  SELECT r.window_key, r.count
  FROM suggestion_rate_limit r
  WHERE r.user_id = v_user_id
    AND r.window_key = ANY(p_window_keys);
END;
$$;
