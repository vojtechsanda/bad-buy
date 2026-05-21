import { ErrorMessage, Input, InputField, ScreenContainer } from '@shared/components';
import { ReactNode, useState } from 'react';
import { Text, View } from 'react-native';

import { OnboardingStickyFooter } from '../OnboardingStickyFooter';
import { OnboardingTitle } from '../OnboardingTitle';

type PromoViewProps = {
  onComplete: () => void;
  screenHeader?: ReactNode;
};

export function PromoView({ onComplete, screenHeader }: PromoViewProps) {
  const [code, setCode] = useState('');
  const error = null;

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
          title="Got a code?"
          subtitle="Enter your promo or referral code to unlock 3 months of Premium."
        />

        <View className="gap-6 pt-6">
          <View>
            <Input size="2xl" style={{ height: 56 }}>
              <InputField
                value={code}
                onChangeText={(text) => setCode(text.toLocaleUpperCase())}
                placeholder="ENTER CODE"
                autoCapitalize="characters"
                autoCorrect={false}
                textAlign="center"
                className="font-mono tracking-widest"
              />
            </Input>
            <ErrorMessage message={error} />
          </View>

          <Text className="px-12 text-center font-nunito text-body  text-typography-600 ">
            Premium unlocks unlimited custom hobbies, custom freeze times, and the suggestion
            refresh.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
