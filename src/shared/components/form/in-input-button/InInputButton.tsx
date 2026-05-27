import { themeColor } from '@shared/constants';
import { LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

type InInputButtonProps = {
  onPress: () => void;
  Icon?: LucideIcon;
  content?: string;
};

export function InInputButton({ onPress, Icon, content }: InInputButtonProps) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center rounded-md bg-secondary-100">
      {Icon && (
        <View className="h-11 w-11 items-center justify-center">
          <Icon size={18} strokeWidth={2} color={themeColor.typography900} />
        </View>
      )}
      {content && (
        <View className="h-11 items-center justify-center px-4">
          <Text className="font-nunito-bold text-typography-900">{content}</Text>
        </View>
      )}
    </Pressable>
  );
}
