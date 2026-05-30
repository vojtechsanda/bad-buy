import type {
  Account,
  AccountHobby,
  AccountSuggestion,
  TablesInsert,
} from '../../../src/shared/types/index.ts';

/** Subset of `account` loaded by the edge function. */
export type AccountContext = Pick<Account, 'country' | 'premium_expires_at'>;

/** Subset of `account_hobby` selected when building prompts and mapping rows. */
export type AccountHobbyRef = Pick<AccountHobby, 'id' | 'hobby_name'>;

/** Rows passed to the `replace_suggestions` RPC (required insert fields only). */
export type SuggestionInsertRow = Required<
  Pick<
    TablesInsert<'account_suggestion'>,
    'hobby_id' | 'name' | 'item_emoji' | 'price_usd' | 'country'
  >
>;

export type { AccountSuggestion };
