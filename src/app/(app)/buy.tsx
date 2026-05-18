import BuySendoffSvg from '@assets/illustrations/buy-sendoff.svg';
import { mockAccountHistory } from '@features/account/store';
import { Button, ButtonText, IllustrationSvgFrame, ScreenContainer } from '@shared/components';
import { PostDecisionFeedback } from '@shared/modules/gamification';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

export default function BuyScreen() {
  const accountHistory = mockAccountHistory;

  return (
    <ScreenContainer
      stickyBottom={
        <Button action="primary" onPress={() => router.replace('/(app)/home')}>
          <ButtonText>Continue</ButtonText>
        </Button>
      }
    >
      <IllustrationSvgFrame Svg={BuySendoffSvg} />

      <View className="mt-6 items-center gap-2">
        <Text className="text-center font-nunito-bold text-display-md text-typography-900">
          Enjoy it.
        </Text>
        <Text className="text-center font-nunito text-body text-typography-600">
          You made an informed choice.
        </Text>
      </View>

      <View className="mt-6">
        <PostDecisionFeedback allDecisions={accountHistory} />
      </View>

      <View className="flex-1" />
    </ScreenContainer>
  );
}
