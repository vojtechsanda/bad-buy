import {
  BottomSheet,
  BottomSheetProps,
  PremiumLockGate,
  SelectableChip,
  SheetActions,
  SheetHeader,
} from '@shared/components';
import { hobbyService } from '@shared/modules/account';
import { triggerBackgroundSuggestionsRefresh } from '@shared/modules/audit/service';
import { PredefinedHobbyGrid } from '@shared/modules/hobby';
import { AccountHobby } from '@shared/types';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { AddCustomHobbyForm } from './AddCustomHobbyForm';

type HobbiesSheetProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'> & {
  initialHobbies: AccountHobby[];
};

export function HobbiesSheet({ isOpen, onClose, initialHobbies }: HobbiesSheetProps) {
  const toPredefinedIds = (hobbies: AccountHobby[]) =>
    hobbies.filter((h) => h.predefined_hobby_id !== null).map((h) => h.predefined_hobby_id!);

  const toCustomNames = (hobbies: AccountHobby[]) =>
    hobbies.filter((h) => h.predefined_hobby_id === null).map((h) => h.hobby_name);

  const [selectedIds, setSelectedIds] = useState<string[]>(() => toPredefinedIds(initialHobbies));
  const [customHobbies, setCustomHobbies] = useState<string[]>(() => toCustomNames(initialHobbies));
  const [isSaving, setIsSaving] = useState(false);

  // Reset local selection to the latest SWR data each time the sheet opens.
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(toPredefinedIds(initialHobbies));
      setCustomHobbies(toCustomNames(initialHobbies));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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

  async function handleSave() {
    const currentPredefinedIds = toPredefinedIds(initialHobbies);
    const currentCustomNames = toCustomNames(initialHobbies);

    const addedPredefinedIds = selectedIds.filter((id) => !currentPredefinedIds.includes(id));
    const removedPredefined = initialHobbies.filter(
      (h) => h.predefined_hobby_id !== null && !selectedIds.includes(h.predefined_hobby_id!),
    );
    const addedCustomNames = customHobbies.filter((n) => !currentCustomNames.includes(n));
    const removedCustom = initialHobbies.filter(
      (h) => h.predefined_hobby_id === null && !customHobbies.includes(h.hobby_name),
    );

    const hasChanges =
      addedPredefinedIds.length > 0 ||
      removedPredefined.length > 0 ||
      addedCustomNames.length > 0 ||
      removedCustom.length > 0;

    if (!hasChanges) {
      onClose();

      return;
    }

    setIsSaving(true);
    try {
      await Promise.all([
        addedPredefinedIds.length ? hobbyService.addMany(addedPredefinedIds) : Promise.resolve([]),
        ...removedPredefined.map((h) => hobbyService.remove(h.id)),
        ...addedCustomNames.map((n) => hobbyService.addCustom(n)),
        ...removedCustom.map((h) => hobbyService.remove(h.id)),
      ]);

      void triggerBackgroundSuggestionsRefresh();
      onClose();
    } catch {
      Alert.alert('Error', "Couldn't save your hobbies, please try again.");
    } finally {
      setIsSaving(false);
    }
  }

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
          <PremiumLockGate noBadgeOverflowX>
            <AddCustomHobbyForm onAdd={addCustomHobby} />
          </PremiumLockGate>

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

      <SheetActions
        confirmLabel={isSaving ? 'Saving…' : 'Save'}
        onConfirm={handleSave}
        onCancel={onClose}
        isConfirmDisabled={isSaving}
      />
    </BottomSheet>
  );
}
