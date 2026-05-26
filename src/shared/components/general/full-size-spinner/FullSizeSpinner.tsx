import { Spinner } from '@shared/components/ui';
import { Text, View } from 'react-native';

type FullSizeSpinnerProps = {
  label?: string;
};

export function FullSizeSpinner({ label }: FullSizeSpinnerProps) {
  return (
    <View className="flex h-full w-full flex-col items-center justify-center gap-4">
      <Spinner />
      {label && <Text>{label}</Text>}
    </View>
  );
}
