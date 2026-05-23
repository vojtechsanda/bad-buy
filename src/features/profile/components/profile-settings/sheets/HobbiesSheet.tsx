import {
  BottomSheet,
  BottomSheetProps,
  Button,
  ButtonText,
  PremiumLockGate,
} from '@shared/components';
import { themeColor } from '@shared/constants';
import { mockAccountHobbies } from '@shared/modules/account';
import { MIN_HOBBY_SELECTION, PredefinedHobbyGrid } from '@shared/modules/hobby';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { AddCustomHobbySheet } from './AddCustomHobbySheet';

type HobbiesSheetProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'>;

export function HobbiesSheet({ isOpen, onClose }: HobbiesSheetProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(mockAccountHobbies);
  const [customHobbies, setCustomHobbies] = useState<string[]>([]);
  const [addCustomOpen, setAddCustomOpen] = useState(false);
  const [showMinMessage, setShowMinMessage] = useState(false);

  function toggleHobby(id: string) {
    if (selectedIds.includes(id) && selectedIds.length <= MIN_HOBBY_SELECTION) {
      setShowMinMessage(true);

      return;
    }
    setShowMinMessage(false);
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }

  function removeCustomHobby(name: string) {
    setCustomHobbies((prev) => prev.filter((h) => h !== name));
  }

  function confirmRemoveCustomHobby(name: string) {
    Alert.alert('Remove hobby?', `"${name}" will be removed from your list.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeCustomHobby(name) },
    ]);
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
                      <Pressable onPress={() => confirmRemoveCustomHobby(name)} hitSlop={6}>
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
        onAdd={(name) => setCustomHobbies((prev) => [...prev, name])}
      />
    </>
  );
}
