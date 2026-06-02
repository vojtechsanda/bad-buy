import { Account } from '@shared/types';

export type AuditReFreezePayload = {
  account: Account;
  trackedItemId: string;
  name: string;
  durationMs: number;
};

export type AuditLateSkipDecisionPayload = {
  price: number | string;
  currency: string;
};
