import { Button, ButtonText, ScreenContainer } from '@shared/components';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

export default function Login() {
  const router = useRouter();

  return (
    <ScreenContainer withSafeAreaTop={true}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-display-sm font-nunito-semibold text-typography-900">
          This is a mockup login screen, it does nothing for now. 🐰
        </Text>
      </View>
      <Button onPress={() => router.push('/(auth)/register')}>
        <ButtonText>Go back to register</ButtonText>
      </Button>
    </ScreenContainer>
  );
}
