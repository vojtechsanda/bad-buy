-- Enable Supabase Realtime for all app tables.
-- replica identity full is required so UPDATE/DELETE payloads include the old row.

alter publication supabase_realtime add table
  account,
  account_hobby,
  account_suggestion,
  currency,
  currency_rate,
  notification,
  predefined_hobby,
  promo_code,
  referral_redemption,
  tracked_item;

alter table account replica identity full;
alter table account_hobby replica identity full;
alter table account_suggestion replica identity full;
alter table currency replica identity full;
alter table currency_rate replica identity full;
alter table notification replica identity full;
alter table predefined_hobby replica identity full;
alter table promo_code replica identity full;
alter table referral_redemption replica identity full;
alter table tracked_item replica identity full;
