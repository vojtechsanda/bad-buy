import { DAY, HOUR, MINUTE } from '@shared/constants';

export const durationUnits = ['minutes', 'hours', 'days', 'weeks'] as const;
export type DurationUnit = (typeof durationUnits)[number];

export const predefinedDurations = [
  { label: '30 minutes', durationMs: 30 * MINUTE },
  { label: '6 hours', durationMs: 6 * HOUR },
  { label: '1 day', durationMs: DAY },
  { label: '1 week', durationMs: 7 * DAY },
] as const;

export const unitToMilliseconds: Record<DurationUnit, number> = {
  minutes: MINUTE,
  hours: HOUR,
  days: DAY,
  weeks: 7 * DAY,
};
