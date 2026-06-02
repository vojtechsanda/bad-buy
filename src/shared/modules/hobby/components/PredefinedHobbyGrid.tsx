import { ErrorMessage, Spinner } from '@shared/components';
import { usePredefinedHobbiesByCategorySWR } from '@shared/modules/hobby/hooks';
import { View } from 'react-native';

import { HobbyCategoryGroup } from './HobbyCategoryGroup';

type PredefinedHobbyGridProps = {
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function PredefinedHobbyGrid({ selectedIds, onToggle }: PredefinedHobbyGridProps) {
  const { predefinedHobbiesByCategory, isLoading } = usePredefinedHobbiesByCategorySWR();

  if (isLoading) return <Spinner />;
  if (!predefinedHobbiesByCategory) return <ErrorMessage message="Failed to load hobbies." />;

  return (
    <View className="gap-6">
      {Object.entries(predefinedHobbiesByCategory).map(([category, hobbies]) => (
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
