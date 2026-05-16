import { themeColor } from '@shared/constants';
import { ChevronRight } from 'lucide-react-native';
import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

type SettingsRowProps = {
  label: string;
  danger?: boolean;
  onPress?: () => void;
  trailing?: ReactNode;
  isLastRow?: boolean;
};

export function SettingsRow({
  label,
  danger = false,
  onPress,
  trailing: right,
  isLastRow,
}: SettingsRowProps) {
  return (
    <View
      className="border-b"
      style={{
        borderBottomColor: themeColor.outline100,
        ...(isLastRow ? { borderBottomWidth: 0 } : {}),
      }}
    >
      <Pressable
        onPress={onPress}
        className="flex-row items-center justify-between px-5 active:opacity-70"
        style={{ height: 64 }}
      >
        <Text
          className={`font-nunito-semibold text-body-lg ${danger ? 'text-error-500' : 'text-typography-900'}`}
        >
          {label}
        </Text>
        {right ?? <ChevronRight size={24} strokeWidth={1.75} color={themeColor.typography400} />}
      </Pressable>
    </View>
  );
}
