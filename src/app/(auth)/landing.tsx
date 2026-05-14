import { isLogged } from '@features/auth/store';
import { ScreenContainer } from '@shared/components';
import { Button, ButtonText } from '@shared/components/ui/button';
import { Redirect, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

export default function Landing() {
  const router = useRouter();

  if (isLogged) return <Redirect href="/(app)/home" />;

  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center">
        <Text>Welcome, please sign in or sign up. 🐰</Text>
      </View>
      <Button onPress={() => router.push('/(auth)/register')}>
        <ButtonText>Create account</ButtonText>
      </Button>
    </ScreenContainer>
  );
}
