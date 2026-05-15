import { Text, View } from 'react-native';

type StatisticsCardProps = {
  caption: string;
  value: string | number;
};

export function StatisticsCard({ caption, value }: StatisticsCardProps) {
  return (
    <View className="rounded-lg bg-background-100 p-5">
      <Text className="font-nunito-semibold text-caption uppercase tracking-widest text-typography-400">
        {caption.toLocaleUpperCase()}
      </Text>
      <Text className="mt-2 font-nunito-extrabold text-display-xl text-typography-900">
        {value ?? '—'}
      </Text>
    </View>
  );
}
