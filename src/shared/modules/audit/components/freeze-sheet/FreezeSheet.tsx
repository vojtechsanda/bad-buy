import {
  BottomSheet,
  FormField,
  InputFormField,
  PremiumLockGate,
  SelectableChip,
  SheetActions,
  SheetHeader,
} from '@shared/components';
import { defaultFormValidationLogic } from '@shared/constants';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { View } from 'react-native';

import { CustomDurationInput } from './CustomDurationInput';
import { DurationUnit, predefinedDurations, unitToMilliseconds } from './constants';
import { FreezeSchema } from './schemas';
import { resetCustomDuration } from './utils';

type FreezeSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  onFreeze: (name: string, durationMs: number) => void;
};

export function FreezeSheet({
  isOpen,
  onClose,
  title = 'Freeze this decision',
  onFreeze,
}: FreezeSheetProps) {
  const [customDurationExpanded, setCustomDurationExpanded] = useState(false);
  const [customDurationValue, setCustomDurationValue] = useState('');
  const [selectedCustomUnit, setSelectedCustomUnit] = useState<DurationUnit>('hours');

  const form = useForm({
    defaultValues: { name: '', durationMs: 0 },
    validationLogic: defaultFormValidationLogic,
    validators: { onDynamic: FreezeSchema },
    onSubmit: ({ value }) => {
      onFreeze(value.name, value.durationMs);
      form.reset();
      setCustomDurationExpanded(false);
      resetCustomDuration(setCustomDurationValue, setSelectedCustomUnit);
      onClose();
    },
  });

  const handlePredefinedSelect = (predefinedDurationMs: number) => {
    form.setFieldValue('durationMs', predefinedDurationMs);
    setCustomDurationExpanded(false);
    resetCustomDuration(setCustomDurationValue, setSelectedCustomUnit);
  };

  const handleCustomToggle = () => {
    if (customDurationExpanded) {
      resetCustomDuration(setCustomDurationValue, setSelectedCustomUnit);
    }
    setCustomDurationExpanded((previousExpanded) => !previousExpanded);
    form.setFieldValue('durationMs', 0);
  };

  const handleCustomValueChange = (value: string) => {
    setCustomDurationValue(value);
    const parsed = parseInt(value, 10);
    form.setFieldValue(
      'durationMs',
      isNaN(parsed) ? 0 : parsed * unitToMilliseconds[selectedCustomUnit],
    );
  };

  const handleCustomUnitChange = (durationUnit: DurationUnit) => {
    setSelectedCustomUnit(durationUnit);
    const parsed = parseInt(customDurationValue, 10);
    form.setFieldValue('durationMs', isNaN(parsed) ? 0 : parsed * unitToMilliseconds[durationUnit]);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} heightMode={0.7}>
      <View className="flex-1 gap-6 pt-3">
        <SheetHeader title={title} />

        <form.Field name="name">
          {(field) => <InputFormField field={field} label="Name it" placeholder="What is it?" />}
        </form.Field>

        <form.Field name="durationMs">
          {(field) => (
            <FormField field={field} label="Decide in…">
              <View className="flex-row flex-wrap gap-2">
                {predefinedDurations.map((predefinedDuration) => (
                  <SelectableChip
                    key={predefinedDuration.label}
                    label={predefinedDuration.label}
                    selected={
                      field.state.value === predefinedDuration.durationMs && !customDurationExpanded
                    }
                    onPress={() => handlePredefinedSelect(predefinedDuration.durationMs)}
                  />
                ))}
              </View>
            </FormField>
          )}
        </form.Field>

        <PremiumLockGate noBadgeOverflowX>
          <CustomDurationInput
            value={customDurationValue}
            selectedUnit={selectedCustomUnit}
            expanded={customDurationExpanded}
            onToggle={handleCustomToggle}
            onValueChange={handleCustomValueChange}
            onUnitChange={handleCustomUnitChange}
          />
        </PremiumLockGate>
      </View>
      <SheetActions confirmLabel="Freeze it" onConfirm={form.handleSubmit} />
    </BottomSheet>
  );
}
