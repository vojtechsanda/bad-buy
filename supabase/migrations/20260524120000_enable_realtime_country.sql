-- Enable Supabase Realtime for the country reference table.

alter publication supabase_realtime add table country;

alter table country replica identity full;
