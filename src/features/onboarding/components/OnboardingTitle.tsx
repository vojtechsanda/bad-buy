import { InfoAlertButton } from '@shared/components/general/info-alert-button/InfoAlertButton';
import { Text, View } from 'react-native';

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
              <View className="pl-1.5">
                <InfoAlertButton title="Better suggestions" message={infoMessage} />
              </View>
            )}
          </Text>
        </View>
      )}
    </View>
  );
}
