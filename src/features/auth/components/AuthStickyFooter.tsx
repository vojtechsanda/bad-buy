import { Button, ButtonText } from '@shared/components';
import { Pressable, Text, View } from 'react-native';

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
    <View className={` ${className} `}>
      <Button
        className="h-16 w-full rounded-md"
        onPress={onCtaPress}
        isDisabled={ctaDisabled || isLoading}>
        <ButtonText className="font-nunito-bold text-white">{label}</ButtonText>
      </Button>
      <View className="h-4" />
      <View className="flex-row justify-center">
        <Text className="text-body-sm text-typography-500">{footerText}</Text>
        <Pressable onPress={onFooterLinkPress}>
          <Text className="font-nunito-semibold text-body-sm text-primary-500 underline">
            {footerLinkLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
