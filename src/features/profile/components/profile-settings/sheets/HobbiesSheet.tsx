import {
  BottomSheet,
  BottomSheetProps,
  Button,
  ButtonText,
  PremiumLockGate,
  SheetHeader,
} from '@shared/components';
import { Input, InputField } from '@shared/components/ui';
import { MIN_HOBBY_SELECTION, PredefinedHobbyGrid } from '@shared/modules/hobby';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

type HobbiesSheetProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'> & {
  hobbyIds: string[];
};

export function HobbiesSheet({ isOpen, onClose, hobbyIds }: HobbiesSheetProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(hobbyIds);
  const [customHobbies, setCustomHobbies] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
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

  function addCustomHobby() {
    const trimmedName = customInput.trim();
    if (!trimmedName || customHobbies.includes(trimmedName)) return;
    setCustomHobbies((previousHobbies) => [...previousHobbies, trimmedName]);
    setCustomInput('');
  }

  function removeCustomHobby(name: string) {
    setCustomHobbies((previousHobbies) => previousHobbies.filter((hobby) => hobby !== name));
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
    <BottomSheet isOpen={isOpen} onClose={onClose} heightMode={0.92}>
      <View style={{ flex: 1 }}>
        <View className="mb-4">
          <SheetHeader title="Hobbies" />
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View className="gap-6 pb-4">
            <Text className="font-nunito-semibold text-body-sm text-typography-400">
              {selectedIds.length + customHobbies.length} selected
            </Text>

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

            <PremiumLockGate>
              <View className="flex-row gap-2">
                <View className="flex-1" style={{ minWidth: 0 }}>
                  <Input size="2xl">
                    <InputField
                      value={customInput}
                      onChangeText={setCustomInput}
                      placeholder="Add a hobby…"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={addCustomHobby}
                    />
                  </Input>
                </View>
                <Button
                  size="md"
                  action="primary"
                  variant="outline"
                  onPress={addCustomHobby}
                  isDisabled={!customInput.trim()}
                >
                  <ButtonText>Add</ButtonText>
                </Button>
              </View>
            </PremiumLockGate>
          </View>
        </ScrollView>

        <View className="gap-2 border-t border-outline-200 pt-3">
          <Button size="lg" action="primary" onPress={handleSave}>
            <ButtonText>Save</ButtonText>
          </Button>
          <Button size="lg" variant="outline" onPress={onClose}>
            <ButtonText>Cancel</ButtonText>
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}
