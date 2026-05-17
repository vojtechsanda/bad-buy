
ALTER TABLE account_suggestion
  ADD CONSTRAINT account_suggestion_hobby_id_country_key
  UNIQUE (hobby_id, country);
