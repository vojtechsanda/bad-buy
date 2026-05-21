import { HobbyChip } from '@shared/components';
import { HelpCircle } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { PredefinedHobby } from '../store';
import { getHobbyIcon } from '../utils';

type HobbyCategoryGroupProps = {
  category: string;
  hobbies: PredefinedHobby[];
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function HobbyCategoryGroup({
  category,
  hobbies,
  selectedIds,
  onToggle,
}: HobbyCategoryGroupProps) {
  return (
    <View className="gap-3">
      <Text className="font-nunito-bold text-body text-typography-900">{category}</Text>
      <View className="flex-row flex-wrap gap-2">
        {hobbies.map((hobby) => {
          const icon = getHobbyIcon(hobby.lucide_icon) ?? HelpCircle;

          return (
            <HobbyChip
              key={hobby.id}
              label={hobby.name}
              icon={icon}
              selected={selectedIds.includes(hobby.id)}
              onPress={() => onToggle(hobby.id)}
            />
          );
        })}
      </View>
    </View>
  );
}
