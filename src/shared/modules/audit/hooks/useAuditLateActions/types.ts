export type AuditReFreezePayload = {
  trackedItemId: string;
  name: string;
  durationMs: number;
};

export type AuditLateSkipDecisionPayload = {
  price: number | string;
  currency: string;
};
