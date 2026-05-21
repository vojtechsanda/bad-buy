import { Button, ButtonText } from '@shared/components';
import { Pressable, Text, View } from 'react-native';

type OnboardingStickyFooterProps = {
  onPress: () => void;
  disabled?: boolean;
  onSkip?: () => void;
  onPromoLinkTap?: () => void;
};

export function OnboardingStickyFooter({
  onPress,
  disabled,
  onSkip,
  onPromoLinkTap,
}: OnboardingStickyFooterProps) {
  return (
    <View className="gap-3">
      <Pressable
        onPress={onPromoLinkTap}
        disabled={!onPromoLinkTap}
        className={`items-center py-1 ${!onPromoLinkTap ? 'hidden' : 'opacity-100'}`}
      >
        <Text className="font-nunito text-body text-primary-500 underline">
          I have a promo code
        </Text>
      </Pressable>
      <Button onPress={onPress} isDisabled={disabled}>
        <ButtonText className="font-nunito-bold text-white">Continue</ButtonText>
      </Button>
      {onSkip && (
        <Pressable onPress={onSkip} className="items-center py-1">
          <Text className="font-nunito text-body text-typography-500">Skip for now</Text>
        </Pressable>
      )}
    </View>
  );
}
