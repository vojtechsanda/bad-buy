import type {
  Account,
  AccountHobby,
  AccountSuggestion,
  TablesInsert,
} from '../../../src/shared/types/index.ts';

export type AccountContext = Pick<Account, 'country' | 'premium_expires_at'>;

export type AccountHobbyRef = Pick<AccountHobby, 'id' | 'hobby_name'>;

export type SuggestionInsertRow = Required<
  Pick<
    TablesInsert<'account_suggestion'>,
    'hobby_id' | 'name' | 'item_emoji' | 'price_usd' | 'country'
  >
>;

export type { AccountSuggestion };

export type StepResult<T> = { ok: true; value: T } | { ok: false; response: Response };

export function stepOk<T>(value: T): StepResult<T> {
  return { ok: true, value };
}

export function stepFail(response: Response): StepResult<never> {
  return { ok: false, response };
}
