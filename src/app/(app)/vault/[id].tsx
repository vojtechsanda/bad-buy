import { ScreenContainer } from '@shared/components';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

// TODO: implement vault item detail screen (re-uses audit UI)
export default function VaultItem() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenContainer withSafeAreaTop>
      <View className="flex-1 items-center justify-center">
        <Text className="font-nunito text-body text-typography-600">Item {id}</Text>
      </View>
    </ScreenContainer>
  );
}
