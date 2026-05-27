import {
  BottomSheet,
  BottomSheetProps,
  SelectableChip,
  SheetActions,
  SheetHeader,
} from '@shared/components';
import { PredefinedHobbyGrid } from '@shared/modules/hobby';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { AddCustomHobbyForm } from './AddCustomHobbyForm';

type HobbiesSheetProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'> & {
  hobbyIds: string[];
};

export function HobbiesSheet({ isOpen, onClose, hobbyIds }: HobbiesSheetProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(hobbyIds);
  const [customHobbies, setCustomHobbies] = useState<string[]>([]);

  function toggleHobby(id: string) {
    setSelectedIds((previousIds) =>
      previousIds.includes(id)
        ? previousIds.filter((selectedId) => selectedId !== id)
        : [...previousIds, id],
    );
  }

  function addCustomHobby(name: string) {
    if (!customHobbies.includes(name)) {
      setCustomHobbies((previousHobbies) => [...previousHobbies, name]);
    }
  }

  function removeCustomHobby(name: string) {
    setCustomHobbies((previousHobbies) => previousHobbies.filter((hobby) => hobby !== name));
  }

  const handleSave = () => {
    // TODO: wire save to Supabase (#121)
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <View className="mb-4">
        <SheetHeader title="Hobbies" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="gap-6 pb-4">
          <Text className="font-nunito-semibold text-body-sm text-typography-400">
            {selectedIds.length + customHobbies.length} selected
          </Text>
          {/* <PremiumLockGate noBadgeOverflowX> */}
          <AddCustomHobbyForm onAdd={addCustomHobby} />
          {/* </PremiumLockGate> */}

          {customHobbies.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
              <View className="gap-3">
                <Text className="font-nunito-bold text-body text-typography-900">
                  My custom hobbies
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {customHobbies.map((name) => (
                    <SelectableChip
                      key={name}
                      label={name}
                      selected={true}
                      onRemove={() => removeCustomHobby(name)}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}

          <PredefinedHobbyGrid selectedIds={selectedIds} onToggle={toggleHobby} />
        </View>
      </ScrollView>

      <SheetActions confirmLabel="Save" onConfirm={handleSave} onCancel={onClose} />
    </BottomSheet>
  );
}
