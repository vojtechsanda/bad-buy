import SkipCelebrationSvg from '@assets/illustrations/skip-celebration.svg';
import { mockAccountHistory } from '@features/account';
import {
  Button,
  ButtonText,
  ConfettiBlast,
  IllustrationSvgFrame,
  ScreenContainer,
} from '@shared/components';
import { CurrencyCode } from '@shared/modules/currency';
import { PostDecisionFeedback } from '@shared/modules/gamification';
import { formatPrice, playCelebrationHaptics } from '@shared/utils';
import { Redirect, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Text, View } from 'react-native';

export default function SkipScreen() {
  const { price, currency } = useLocalSearchParams<{ price: string; currency: CurrencyCode }>();

  useFocusEffect(
    useCallback(() => {
      playCelebrationHaptics();
    }, []),
  );

  const accountHistory = mockAccountHistory;

  if (!price || !currency) {
    return <Redirect href="/(app)/home" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScreenContainer
        stickyBottom={
          <Button action="primary" onPress={() => router.replace('/(app)/home')}>
            <ButtonText>Continue</ButtonText>
          </Button>
        }
      >
        <View className="flex-1 items-center px-5">
          <IllustrationSvgFrame Svg={SkipCelebrationSvg} />

          <View className="mt-6 w-full gap-6">
            <View className="items-center gap-2">
              <Text className="text-center font-nunito-extrabold text-display-xl text-primary-500">
                +{formatPrice(price, currency)}
              </Text>
              <Text className="text-center font-nunito text-body text-typography-600">
                Saved on this one temptation
              </Text>
            </View>

            <PostDecisionFeedback allDecisions={accountHistory} />
          </View>
        </View>
      </ScreenContainer>

      <ConfettiBlast />
    </View>
  );
}
