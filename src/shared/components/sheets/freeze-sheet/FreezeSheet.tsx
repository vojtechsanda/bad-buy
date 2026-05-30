import {
  BottomSheet,
  Button,
  ButtonText,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  PremiumLockGate,
  SelectableChip,
  SheetHeader,
} from '@shared/components';
import { themeColor } from '@shared/constants';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

const PredefinedDurations = [
  { label: '30 minutes', durationMs: 30 * 60 * 1000 },
  { label: '6 hours', durationMs: 6 * 60 * 60 * 1000 },
  { label: '1 day', durationMs: 24 * 60 * 60 * 1000 },
  { label: '1 week', durationMs: 7 * 24 * 60 * 60 * 1000 },
] as const;

const DurationUnits = ['minutes', 'hours', 'days'] as const;
type DurationUnit = (typeof DurationUnits)[number];

const UnitToMilliseconds: Record<DurationUnit, number> = {
  minutes: 60 * 1000,
  hours: 60 * 60 * 1000,
  days: 24 * 60 * 60 * 1000,
};

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
  const [itemName, setItemName] = useState('');
  const [selectedPredefinedDurationMs, setSelectedPredefinedDurationMs] = useState<number | null>(
    null,
  );
  const [customDurationExpanded, setCustomDurationExpanded] = useState(false);
  const [customDurationValue, setCustomDurationValue] = useState('');
  const [selectedCustomUnit, setSelectedCustomUnit] = useState<DurationUnit>('hours');

  useEffect(() => {
    if (!isOpen) {
      setItemName('');
      setSelectedPredefinedDurationMs(null);
      setCustomDurationExpanded(false);
      setCustomDurationValue('');
      setSelectedCustomUnit('hours');
    }
  }, [isOpen]);

  const customDurationMs =
    customDurationExpanded && customDurationValue.trim().length > 0
      ? parseInt(customDurationValue, 10) * UnitToMilliseconds[selectedCustomUnit]
      : null;

  const resolvedDurationMs = customDurationMs ?? selectedPredefinedDurationMs;

  const canSubmit =
    itemName.trim().length > 0 && resolvedDurationMs !== null && resolvedDurationMs > 0;

  const handlePredefinedSelect = (durationMs: number) => {
    setSelectedPredefinedDurationMs(durationMs);
    setCustomDurationExpanded(false);
    setCustomDurationValue('');
  };

  const handleCustomToggle = () => {
    setCustomDurationExpanded((previousExpanded) => !previousExpanded);
    setSelectedPredefinedDurationMs(null);
  };

  const handleSubmit = () => {
    if (!canSubmit || resolvedDurationMs === null) return;
    onFreeze(itemName.trim(), resolvedDurationMs);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} heightMode={0.7}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <SheetHeader title={title} />

        <View className="mt-5">
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText className="font-nunito text-body-lg text-typography-500">
                Name it
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="3xl">
              <InputField
                value={itemName}
                onChangeText={setItemName}
                placeholder="What is it?"
                autoCapitalize="sentences"
                className="text-xl"
              />
            </Input>
          </FormControl>
        </View>

        <View className="mt-6">
          <Text className="font-nunito-semibold text-body-lg text-typography-900">Decide in…</Text>
          <View className="mt-3 flex-row flex-wrap gap-2">
            {PredefinedDurations.map((predefinedDuration) => (
              <SelectableChip
                key={predefinedDuration.label}
                label={predefinedDuration.label}
                selected={selectedPredefinedDurationMs === predefinedDuration.durationMs}
                onPress={() => handlePredefinedSelect(predefinedDuration.durationMs)}
              />
            ))}
          </View>
        </View>

        <View className="mt-4">
          <PremiumLockGate noBadgeOverflowX>
            <Pressable
              onPress={handleCustomToggle}
              className="flex-row items-center gap-3 rounded-xl bg-background-50 p-4"
            >
              <Plus size={20} color={themeColor.primary500} />
              <Text className="flex-1 font-nunito-semibold text-body-lg text-typography-900">
                Custom duration
              </Text>
            </Pressable>

            {customDurationExpanded && (
              <View className="mt-2 gap-3">
                <Input size="3xl">
                  <InputField
                    value={customDurationValue}
                    onChangeText={setCustomDurationValue}
                    placeholder="Amount"
                    keyboardType="numeric"
                    className="text-xl"
                  />
                </Input>
                <View className="flex-row gap-2">
                  {DurationUnits.map((durationUnit) => (
                    <SelectableChip
                      key={durationUnit}
                      label={durationUnit.charAt(0).toUpperCase() + durationUnit.slice(1)}
                      selected={selectedCustomUnit === durationUnit}
                      onPress={() => setSelectedCustomUnit(durationUnit)}
                    />
                  ))}
                </View>
              </View>
            )}
          </PremiumLockGate>
        </View>

        <View className="h-4" />
      </ScrollView>

      <View className="pt-4">
        <Button
          variant="solid"
          action="primary"
          size="md"
          isDisabled={!canSubmit}
          onPress={handleSubmit}
        >
          <ButtonText>Freeze it</ButtonText>
        </Button>
      </View>
    </BottomSheet>
  );
}
