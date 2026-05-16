import { TrackedItem } from '@shared/types';
import { Text, View } from 'react-native';

import { VaultRow } from './VaultRow';

type VaultSectionProps = {
  title: string;
  items: TrackedItem[];
};

export function VaultSection({ title, items }: VaultSectionProps) {
  return (
    <View className="gap-3">
      <Text className="font-nunito-bold text-display-md text-typography-900">{title}</Text>
      {items.map((item) => (
        <VaultRow key={item.id} item={item} />
      ))}
    </View>
  );
}
