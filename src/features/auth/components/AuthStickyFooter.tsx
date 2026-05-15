import { Button, ButtonText } from '@shared/components';
import { Text, View } from 'react-native';

type AuthStickyFooterProps = {
  ctaLabel: string;
  ctaLoadingLabel?: string;
  onCtaPress: () => void;
  ctaDisabled?: boolean;
  isLoading?: boolean;
  footerText: string;
  footerLinkLabel: string;
  onFooterLinkPress: () => void;
  className?: string;
};

export function AuthStickyFooter({
  ctaLabel,
  ctaLoadingLabel,
  onCtaPress,
  ctaDisabled,
  isLoading,
  footerText,
  footerLinkLabel,
  onFooterLinkPress,
  className,
}: AuthStickyFooterProps) {
  const label = isLoading && ctaLoadingLabel ? ctaLoadingLabel : ctaLabel;

  return (
    <View className={`pb-6 ${className ?? ''}`}>
      <Button
        className="h-16 w-full rounded-md"
        onPress={onCtaPress}
        isDisabled={ctaDisabled || isLoading}>
        <ButtonText className="font-nunito-bold text-white">{label}</ButtonText>
      </Button>
      <View className="h-4" />
      <View className="flex-row justify-center">
        <Text className="text-center text-body-sm text-typography-500">
          {footerText}
          <Text
            className="font-nunito-semibold text-primary-500 underline"
            onPress={onFooterLinkPress}>
            {footerLinkLabel}
          </Text>
        </Text>
      </View>
    </View>
  );
}
