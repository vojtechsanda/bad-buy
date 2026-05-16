import { Button, ButtonText } from '@shared/components';
import { Text, View } from 'react-native';

type AuthStickyFooterProps = {
  ctaLabel: string;
  ctaLoadingLabel?: string;
  onCtaPress: () => void;
  ctaDisabled?: boolean;
  isLoading?: boolean;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  footerText?: string;
  footerLinkLabel?: string;
  onFooterLinkPress?: () => void;
};

export function AuthStickyFooter({
  ctaLabel,
  ctaLoadingLabel,
  onCtaPress,
  ctaDisabled,
  isLoading,
  secondaryLabel,
  onSecondaryPress,
  footerText,
  footerLinkLabel,
  onFooterLinkPress,
}: AuthStickyFooterProps) {
  const label = isLoading && ctaLoadingLabel ? ctaLoadingLabel : ctaLabel;

  return (
    <View className="gap-3">
      <Button onPress={onCtaPress} isDisabled={ctaDisabled || isLoading}>
        <ButtonText className="font-nunito-bold text-white">{label}</ButtonText>
      </Button>

      {secondaryLabel && onSecondaryPress && (
        <Button className="w-full" variant="link" onPress={onSecondaryPress}>
          <ButtonText>{secondaryLabel}</ButtonText>
        </Button>
      )}

      {footerText && footerLinkLabel && onFooterLinkPress && (
        <View className="flex-row justify-center pb-6">
          <Text className="text-center text-body-sm text-typography-500">
            {footerText}
            <Text
              className="font-nunito-semibold text-primary-500 underline"
              onPress={onFooterLinkPress}
            >
              {footerLinkLabel}
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
}
