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
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { CustomDurationInput } from './CustomDurationInput';
import { DurationUnit, predefinedDurations } from './constants';
import { freezeSchema } from './schemas';
import { parseCustomDurationMs } from './utils';

export type FreezeSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  onFreeze: (name: string, durationMs: number) => void;
  initialName?: string;
  actionLabel?: string;
};

export function FreezeSheet({
  isOpen,
  onClose,
  title = 'Freeze this decision',
  actionLabel = 'Freeze it',
  initialName = '',
  onFreeze,
}: FreezeSheetProps) {
  const [customDurationExpanded, setCustomDurationExpanded] = useState(false);
  const [customDurationValue, setCustomDurationValue] = useState('');
  const [selectedCustomUnit, setSelectedCustomUnit] = useState<DurationUnit>('hours');
  const resetCustomDuration = () => {
    setCustomDurationValue('');
    setSelectedCustomUnit('hours');
  };

  const form = useForm({
    defaultValues: { name: initialName, durationMs: 0 },
    validationLogic: defaultFormValidationLogic,
    validators: { onDynamic: freezeSchema },
    onSubmit: ({ value }) => {
      onFreeze(value.name, value.durationMs);
      form.reset();
      setCustomDurationExpanded(false);
      resetCustomDuration();
      onClose();
    },
  });

  const handlePredefinedSelect = (predefinedDurationMs: number) => {
    form.setFieldValue('durationMs', predefinedDurationMs);
    setCustomDurationExpanded(false);
    resetCustomDuration();
  };

  const handleCustomToggle = () => {
    if (customDurationExpanded) {
      resetCustomDuration();
    }
    setCustomDurationExpanded((previousExpanded) => !previousExpanded);
    form.setFieldValue('durationMs', 0);
  };

  const handleCustomValueChange = (value: string) => {
    setCustomDurationValue(value);
    form.setFieldValue('durationMs', parseCustomDurationMs(value, selectedCustomUnit));
  };

  const handleCustomUnitChange = (durationUnit: DurationUnit) => {
    setSelectedCustomUnit(durationUnit);
    form.setFieldValue('durationMs', parseCustomDurationMs(customDurationValue, durationUnit));
  };

  useFocusEffect(
    useCallback(() => {
      if (!isOpen) {
        form.reset();
        setCustomDurationExpanded(false);
        resetCustomDuration();
      }
    }, [form, isOpen]),
  );

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} heightMode={0.7}>
      <View className="mb-4">
        <SheetHeader title={title} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="gap-6 pb-4">
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
                        field.state.value === predefinedDuration.durationMs &&
                        !customDurationExpanded
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
      </ScrollView>
      <SheetActions confirmLabel={actionLabel} onConfirm={form.handleSubmit} />
    </BottomSheet>
  );
}
