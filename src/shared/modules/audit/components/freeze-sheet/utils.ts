import { DurationUnit, unitToMilliseconds } from './constants';

export const parseCustomDurationMs = (value: string, unit: DurationUnit): number => {
  const parsed = parseInt(value, 10);

  return isNaN(parsed) ? 0 : parsed * unitToMilliseconds[unit];
};
