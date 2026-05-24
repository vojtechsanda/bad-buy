import {
  BottomSheet,
  BottomSheetProps,
  Button,
  ButtonText,
  PremiumLockGate,
} from '@shared/components';
import { themeColor } from '@shared/constants';
import { MIN_HOBBY_SELECTION, PredefinedHobbyGrid } from '@shared/modules/hobby';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AddCustomHobbySheet } from './AddCustomHobbySheet';

type HobbiesSheetProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'> & {
  hobbyIds: string[];
};

export function HobbiesSheet({ isOpen, onClose, hobbyIds }: HobbiesSheetProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(hobbyIds);
  const [customHobbies, setCustomHobbies] = useState<string[]>([]);
  const [addCustomOpen, setAddCustomOpen] = useState(false);
  const [showMinMessage, setShowMinMessage] = useState(false);

  function toggleHobby(id: string) {
    if (selectedIds.includes(id) && selectedIds.length <= MIN_HOBBY_SELECTION) {
      setShowMinMessage(true);

      return;
    }
    setShowMinMessage(false);
    setSelectedIds((previousIds) =>
      previousIds.includes(id)
        ? previousIds.filter((selectedId) => selectedId !== id)
        : [...previousIds, id],
    );
  }

  function removeCustomHobby(name: string) {
    setCustomHobbies((previousHobbies) => previousHobbies.filter((hobby) => hobby !== name));
  }

  const handleSave = () => {
    // TODO: wire save to Supabase (#121)
    onClose();
  };

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose} heightMode={0.92}>
        <View style={{ flex: 1 }}>
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-nunito-bold text-heading text-typography-900">Hobbies</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={20} color={themeColor.typography400} />
            </Pressable>
          </View>

          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View className="gap-6 pb-4">
              <View className="flex-1 flex-row items-center justify-between gap-2 px-2 pt-2">
                <Text className="text-right font-nunito-semibold text-body text-typography-400">
                  {selectedIds.length + customHobbies.length} selected
                </Text>
                <PremiumLockGate>
                  <Button
                    size="md"
                    action="primary"
                    variant="outline"
                    onPress={() => setAddCustomOpen(true)}
                  >
                    <ButtonText>+ Add custom hobby</ButtonText>
                  </Button>
                </PremiumLockGate>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {customHobbies.length === 0 ? (
                  <Text className="font-nunito text-body-sm text-typography-400">
                    No custom hobbies to display
                  </Text>
                ) : (
                  customHobbies.map((name) => (
                    <View
                      key={name}
                      className="flex-row items-center gap-1.5 rounded-full border border-primary-500 bg-primary-500 px-4 py-3"
                    >
                      <Text className="font-nunito-bold text-body text-white">{name}</Text>
                      <Pressable onPress={() => removeCustomHobby(name)} hitSlop={6}>
                        <X size={14} color="white" />
                      </Pressable>
                    </View>
                  ))
                )}
              </View>

              {showMinMessage && (
                <Text className="font-nunito text-body-sm text-error-500">
                  You need at least {MIN_HOBBY_SELECTION} hobbies.
                </Text>
              )}

              <PredefinedHobbyGrid selectedIds={selectedIds} onToggle={toggleHobby} />
            </View>
          </ScrollView>

          <View className="border-t border-outline-200 pt-3">
            <Button size="lg" action="primary" onPress={handleSave}>
              <ButtonText>Save</ButtonText>
            </Button>
          </View>
        </View>
      </BottomSheet>

      <AddCustomHobbySheet
        isOpen={addCustomOpen}
        onClose={() => setAddCustomOpen(false)}
        existingNames={customHobbies}
        onAdd={(newHobby) => setCustomHobbies((previousHobbies) => [...previousHobbies, newHobby])}
      />
    </>
  );
}
