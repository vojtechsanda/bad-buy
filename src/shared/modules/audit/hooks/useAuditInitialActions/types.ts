import { SuggestionInput } from '@shared/services';
import { Account } from '@shared/types';

type AuditSuggestions = SuggestionInput[];

export type AuditFreezePayload = {
  account: Account;
  price: number | string;
  currency: string;
  name: string;
  durationMs: number;
  suggestions: AuditSuggestions;
};

export type AuditInitialDecisionPayload = {
  price: number | string;
  currency: string;
  suggestions?: AuditSuggestions;
};
