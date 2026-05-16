import { AuthStickyFooter } from '@features/auth';
import { IllustrationFrame, ScreenContainer } from '@shared/components';
import { router } from 'expo-router';
import { Text, View, useWindowDimensions } from 'react-native';

export default function Landing() {
  const { height } = useWindowDimensions();

  return (
    <ScreenContainer
      withSafeAreaTop={true}
      stickyBottom={
        <AuthStickyFooter
          ctaLabel="Create account"
          onCtaPress={() => router.navigate('/(auth)/register')}
          secondaryLabel="I already have an account"
          onSecondaryPress={() => router.navigate('/(auth)/login')}
        />
      }
    >
      <IllustrationFrame
        source={require('@assets/images/landing.jpeg')}
        style={{ height: height * 0.5 }}
        alt="cat"
      />

      <View className="mt-6 items-center gap-3">
        <Text className="text-center font-nunito-bold text-display-lg text-typography-900">
          Pause before you buy.
        </Text>
        <Text className="w-[90%] text-center font-nunito-semibold text-body-lg text-typography-600">
          See the true cost of what you spend. Skip what doesn't matter.
        </Text>
      </View>
    </ScreenContainer>
  );
}
