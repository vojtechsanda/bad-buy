import { themeColor } from '@shared/constants';
import { Info } from 'lucide-react-native';
import { Alert, Pressable, Text, View } from 'react-native';

type OnboardingTitleProps = {
  title: string;
  subtitle?: string;
  infoMessage?: string;
};

export function OnboardingTitle({ title, subtitle, infoMessage }: OnboardingTitleProps) {
  return (
    <View className="gap-1.5">
      <Text className="font-nunito-bold text-display-lg text-typography-900">{title}</Text>
      {subtitle && (
        <View className="flex-row items-center gap-1.5">
          <Text className="flex-1 font-nunito text-heading text-typography-500">
            {subtitle}
            {infoMessage && (
              <Pressable onPress={() => Alert.alert('Better suggestions', infoMessage)} hitSlop={8}>
                <Info size={14} strokeWidth={2} color={themeColor.typography400} />
              </Pressable>
            )}
          </Text>
        </View>
      )}
    </View>
  );
}
