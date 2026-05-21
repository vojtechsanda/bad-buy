import type { Enums, Tables, TablesInsert, TablesUpdate } from './database';

export type { TablesInsert, TablesUpdate };

export type NotificationType = Enums<'notification_type'>;
export type TrackedItemStatus = Enums<'tracked_item_status'>;

export type Account = Tables<'account'>;
export type AccountHobby = Tables<'account_hobby'>;
export type AccountSuggestion = Tables<'account_suggestion'>;
export type Currency = Tables<'currency'>;
export type CurrencyRate = Tables<'currency_rate'>;
export type Notification = Tables<'notification'>;
export type PredefinedHobby = Tables<'predefined_hobby'>;
export type PromoCode = Tables<'promo_code'>;
export type ReferralRedemption = Tables<'referral_redemption'>;
export type TrackedItem = Tables<'tracked_item'>;
export type TrackedItemSuggestion = Tables<'tracked_item_suggestion'>;
