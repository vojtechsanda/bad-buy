import { View } from 'react-native';

import { hobbyCategories, mockHobbies } from '../store';
import { HobbyCategoryGroup } from './HobbyCategoryGroup';

type Props = {
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function PredefinedHobbyGrid({ selectedIds, onToggle }: Props) {
  return (
    <View className="gap-6">
      {hobbyCategories.map((category) => (
        <HobbyCategoryGroup
          key={category}
          category={category}
          hobbies={mockHobbies.filter((h) => h.category === category)}
          selectedIds={selectedIds}
          onToggle={onToggle}
        />
      ))}
    </View>
  );
}
