import { View } from 'react-native';

type StepProgressBarProps = {
  current: number;
  total: number;
};

export function StepProgressBar({ current, total }: StepProgressBarProps) {
  return (
    <View className="flex-1 flex-row gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={`h-1 flex-1 rounded-full ${i < current ? 'bg-primary-500' : 'bg-outline-200'}`}
        />
      ))}
    </View>
  );
}
