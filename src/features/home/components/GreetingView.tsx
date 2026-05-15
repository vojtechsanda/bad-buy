import { Text, View } from 'react-native';

import { getGreeting } from '../utils';

type GreetingViewProps = {
  name: string;
};

export function GreetingView({ name }: GreetingViewProps) {
  return (
    <View className="gap-1">
      <Text className="font-nunito-extrabold text-display-lg text-typography-900">
        {getGreeting(name)}
      </Text>
      <Text className="font-nunito text-body text-typography-600">
        What are you thinking about?
      </Text>
    </View>
  );
}
