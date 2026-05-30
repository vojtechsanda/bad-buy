import { DurationUnit } from './constants';

export const resetCustomDuration = (
  setCustomDurationValue: (value: string) => void,
  setSelectedCustomUnit: (unit: DurationUnit) => void,
) => {
  setCustomDurationValue('');
  setSelectedCustomUnit('hours');
};
