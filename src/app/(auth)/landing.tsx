import { ScreenContainer } from '@shared/components';
import { Text, View } from 'react-native';

export default function Landing() {
  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center">
        <Text>Welcome, please sign in or sign up. 🐰</Text>
      </View>
    </ScreenContainer>
  );
}
