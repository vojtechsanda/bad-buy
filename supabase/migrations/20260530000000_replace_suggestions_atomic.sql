-- Atomically replaces cached suggestions for a set of hobbies/country.
-- Both the delete and insert run inside the same implicit plpgsql transaction,
-- so a failed insert rolls back the delete and the old cache is preserved.
-- Runs as SECURITY INVOKER so the caller's RLS policies still apply.

CREATE OR REPLACE FUNCTION replace_suggestions(
  p_hobby_ids  uuid[],
  p_country    text,
  p_rows       jsonb
)
RETURNS SETOF account_suggestion
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM account_suggestion
  WHERE hobby_id = ANY(p_hobby_ids)
    AND country = p_country;

  RETURN QUERY
  INSERT INTO account_suggestion (hobby_id, name, item_emoji, price_usd, country)
  SELECT
    (r->>'hobby_id')::uuid,
    r->>'name',
    r->>'item_emoji',
    (r->>'price_usd')::decimal,
    r->>'country'
  FROM jsonb_array_elements(p_rows) AS r
  RETURNING *;
END;
$$;
