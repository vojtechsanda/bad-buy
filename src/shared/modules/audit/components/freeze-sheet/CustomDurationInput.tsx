import { Input, InputField, SelectableChip } from '@shared/components';
import { themeColor } from '@shared/constants';
import { Plus } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { DurationUnit, durationUnits } from './constants';

type CustomDurationInputProps = {
  value: string;
  selectedUnit: DurationUnit;
  expanded: boolean;
  onToggle: () => void;
  onValueChange: (value: string) => void;
  onUnitChange: (unit: DurationUnit) => void;
};

export function CustomDurationInput({
  value,
  selectedUnit,
  expanded,
  onToggle,
  onValueChange,
  onUnitChange,
}: CustomDurationInputProps) {
  return (
    <View className="gap-3 rounded-md bg-background-50 p-4">
      <Pressable onPress={onToggle} className="flex-row items-center gap-3">
        <Plus size={20} color={themeColor.primary500} />
        <Text className="flex-1 font-nunito-semibold text-body-lg text-typography-900">
          Custom duration
        </Text>
      </Pressable>

      {expanded && (
        <View className="gap-3">
          <Input size="3xl">
            <InputField
              value={value}
              onChangeText={onValueChange}
              placeholder="0"
              keyboardType="numeric"
              className="text-xl"
            />
          </Input>
          <View className="flex-row flex-wrap gap-2">
            {durationUnits.map((durationUnit) => (
              <SelectableChip
                key={durationUnit}
                label={durationUnit.charAt(0).toUpperCase() + durationUnit.slice(1)}
                selected={selectedUnit === durationUnit}
                onPress={() => onUnitChange(durationUnit)}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
