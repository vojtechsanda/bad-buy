import { Text, View } from 'react-native';

export function VaultEmptyView() {
  return (
    <View className="flex-1 items-center justify-center py-16">
      <Text className="text-center font-nunito text-body text-typography-600">
        Nothing frozen yet — items you freeze on the Audit screen will appear here.
      </Text>
    </View>
  );
}
