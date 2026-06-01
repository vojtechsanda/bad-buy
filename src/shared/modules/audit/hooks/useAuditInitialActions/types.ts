import { SuggestionInput } from '@shared/services';

type AuditSuggestions = SuggestionInput[];

export type AuditFreezePayload = {
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
