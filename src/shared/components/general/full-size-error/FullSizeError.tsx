import { View } from 'react-native';

import { ErrorMessage } from '../error-message';

type FullSizeErrorProps = {
  message: string;
};

export function FullSizeError({ message }: FullSizeErrorProps) {
  return (
    <View className="flex h-full w-full flex-col items-center justify-center gap-4">
      <ErrorMessage message={message} />
    </View>
  );
}
