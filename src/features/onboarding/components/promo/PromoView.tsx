import { Input, InputField, ScreenContainer } from '@shared/components';
import { ReactNode, useState } from 'react';
import { View } from 'react-native';

import { OnboardingStickyFooter } from '../OnboardingStickyFooter';
import { OnboardingTitle } from '../OnboardingTitle';

type PromoViewProps = {
  onComplete: () => void;
  screenHeader?: ReactNode;
};

export function PromoView({ onComplete, screenHeader }: PromoViewProps) {
  const [code, setCode] = useState('');

  return (
    <ScreenContainer
      header={screenHeader}
      withSafeAreaTop
      stickyBottom={
        <OnboardingStickyFooter
          onPress={onComplete}
          disabled={code.length === 0}
          onSkip={onComplete}
        />
      }
    >
      <View className="gap-6">
        <OnboardingTitle
          title="Got a referral code?"
          subtitle="Enter it below to unlock rewards."
        />
        <Input size="3xl">
          <InputField
            value={code}
            onChangeText={(text) => setCode(text.toUpperCase())}
            placeholder="ENTER CODE"
            autoCapitalize="characters"
            autoCorrect={false}
            textAlign="center"
            className="font-mono tracking-widest"
          />
        </Input>
      </View>
    </ScreenContainer>
  );
}
