CREATE TABLE suggestion_rate_limit (
  user_id    uuid  NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  window_key text  NOT NULL,
  count      integer NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, window_key)
);

ALTER TABLE suggestion_rate_limit ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION increment_suggestion_rate_limit(
  p_user_id    uuid,
  p_window_keys text[]
)
RETURNS TABLE (out_window_key text, out_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO suggestion_rate_limit (user_id, window_key, count)
  SELECT p_user_id, k, 1
  FROM unnest(p_window_keys) AS k
  ON CONFLICT (user_id, window_key)
  DO UPDATE SET count = suggestion_rate_limit.count + 1;

  RETURN QUERY
  SELECT r.window_key, r.count
  FROM suggestion_rate_limit r
  WHERE r.user_id = p_user_id
    AND r.window_key = ANY(p_window_keys);
END;
$$;
