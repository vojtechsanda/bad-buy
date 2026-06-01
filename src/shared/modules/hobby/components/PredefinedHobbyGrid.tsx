import { usePredefinedHobbiesSWR } from '@shared/modules/hobby/hooks';
import { View } from 'react-native';

import { HobbyCategoryGroup } from './HobbyCategoryGroup';

type PredefinedHobbyGridProps = {
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function PredefinedHobbyGrid({ selectedIds, onToggle }: PredefinedHobbyGridProps) {
  const { hobbiesByCategory } = usePredefinedHobbiesSWR();

  return (
    <View className="gap-6">
      {Object.entries(hobbiesByCategory).map(([category, hobbies]) => (
        <HobbyCategoryGroup
          key={category}
          category={category}
          hobbies={hobbies}
          selectedIds={selectedIds}
          onToggle={onToggle}
        />
      ))}
    </View>
  );
}
