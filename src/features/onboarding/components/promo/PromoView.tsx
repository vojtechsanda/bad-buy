import { ScreenContainer } from '@shared/components';
import { ReactNode } from 'react';
import { View } from 'react-native';

import { OnboardingStickyFooter } from '../OnboardingStickyFooter';
import { OnboardingTitle } from '../OnboardingTitle';

type PromoViewProps = {
  onComplete: () => void;
  screenHeader?: ReactNode;
};

export function PromoView({ onComplete, screenHeader }: PromoViewProps) {
  return (
    <ScreenContainer
      header={screenHeader}
      withSafeAreaTop
      stickyBottom={<OnboardingStickyFooter onPress={onComplete} onSkip={onComplete} />}
    >
      <View className="flex-col gap-8">
        <OnboardingTitle
          title="Got a referral code?"
          subtitle="Enter it below to unlock rewards."
        />
      </View>
    </ScreenContainer>
  );
}
