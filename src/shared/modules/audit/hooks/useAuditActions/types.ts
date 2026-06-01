import { SuggestionInput } from '@shared/services';

type AuditSuggestions = SuggestionInput[];

export type AuditFreezePayload = {
  price: number | string;
  currency: string;
  name: string;
  durationMs: number;
  suggestions: AuditSuggestions;
};

export type AuditReFreezePayload = {
  trackedItemId: string;
  durationMs: number;
};

export type AuditDecisionPayload = {
  price: number | string;
  currency: string;
  suggestions?: AuditSuggestions;
};
