import { ScreenContainer } from '@shared/components';
import { ReactNode } from 'react';
import { View } from 'react-native';

import { OnboardingStickyFooter } from '../OnboardingStickyFooter';
import { OnboardingTitle } from '../OnboardingTitle';

type HobbyViewProps = {
  onComplete: () => void;
  screenHeader?: ReactNode;
};

export function HobbyView({ onComplete, screenHeader }: HobbyViewProps) {
  return (
    <ScreenContainer
      header={screenHeader}
      withSafeAreaTop
      stickyBottom={<OnboardingStickyFooter onPress={onComplete} />}
    >
      <View className="flex-col gap-8">
        <OnboardingTitle
          title="What are you into?"
          subtitle="Pick at least 3. We'll use these to suggest alternatives - like 'this jacket = 4 climbing-gym sessions'."
        />
      </View>
    </ScreenContainer>
  );
}
