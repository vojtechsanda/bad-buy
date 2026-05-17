import { Text, View } from 'react-native';

type OnboardingTitleProps = {
  title: string;
  subtitle?: string;
};

export function OnboardingTitle({ title, subtitle }: OnboardingTitleProps) {
  return (
    <View className="gap-1.5">
      <Text className="font-nunito-bold text-display-lg text-typography-900">{title}</Text>
      {subtitle && <Text className="font-nunito text-heading text-typography-500">{subtitle}</Text>}
    </View>
  );
}
