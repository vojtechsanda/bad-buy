-- Enable Supabase Realtime for the country reference table.

alter publication supabase_realtime add table country;

alter table country replica identity full;

-- Public read-only access for the country reference table (same pattern as currency).

ALTER TABLE country ENABLE ROW LEVEL SECURITY;

CREATE POLICY country_select_public ON country
  FOR SELECT TO anon, authenticated
  USING (true);
