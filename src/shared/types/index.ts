import type { Enums, Tables } from './database.types';

export type ItemStatus = Enums<'item_status'>;
export type CampaignPromoCode = Tables<'campaign_promo_code'>;
export type CurrencyRate = Tables<'currency_rate'>;
export type Profile = Tables<'profile'>;
export type ProfileHobby = Tables<'profile_hobby'>;
export type ProfileSuggestion = Tables<'profile_suggestion'>;
export type TrackedItem = Tables<'tracked_item'>;
