import { Button, ButtonText, ScreenContainer } from '@shared/components';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

export default function Landing() {
  const router = useRouter();

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
