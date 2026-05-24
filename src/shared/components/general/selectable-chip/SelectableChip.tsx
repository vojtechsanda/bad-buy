import { themeColor } from '@shared/constants';
import { LucideIcon } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';

type SelectableChipProps = {
  label: string;
  icon: LucideIcon;
  selected: boolean;
  onPress: () => void;
};

export function SelectableChip({ label, icon: Icon, selected, onPress }: SelectableChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-1.5 rounded-full px-5 py-4 ${
        selected
          ? 'border border-primary-500 bg-primary-500'
          : 'border border-outline-200 bg-background-0'
      }`}
    >
      <Icon
        size={16}
        strokeWidth={2}
        color={selected ? 'white' : themeColor.primary500}
        pointerEvents="none"
      />
      <Text
        className={`font-nunito-bold text-body ${selected ? 'text-white' : 'text-typography-600'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
