import {
  BottomSheet,
  BottomSheetProps,
  PremiumLockGate,
  SelectableChip,
  SheetActions,
  SheetHeader,
} from '@shared/components';
import { hobbyService } from '@shared/modules/account';
import { auditService } from '@shared/modules/audit';
import { PredefinedHobbyGrid } from '@shared/modules/hobby';
import { AccountHobby } from '@shared/types';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { AddCustomHobbyForm } from './AddCustomHobbyForm';

function toPredefinedIds(hobbies: AccountHobby[]) {
  return hobbies.filter((h) => h.predefined_hobby_id !== null).map((h) => h.predefined_hobby_id!);
}

function toCustomNames(hobbies: AccountHobby[]) {
  return hobbies.filter((h) => h.predefined_hobby_id === null).map((h) => h.hobby_name);
}

type HobbiesSheetProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'> & {
  initialHobbies: AccountHobby[];
  onSaved?: () => void;
};

export function HobbiesSheet({ isOpen, onClose, initialHobbies, onSaved }: HobbiesSheetProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => toPredefinedIds(initialHobbies));
  const [customHobbies, setCustomHobbies] = useState<string[]>(() => toCustomNames(initialHobbies));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(toPredefinedIds(initialHobbies));
      setCustomHobbies(toCustomNames(initialHobbies));
    }
  }, [isOpen, initialHobbies]);

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
    const initialPredefinedIds = toPredefinedIds(initialHobbies);
    const initialCustomNames = toCustomNames(initialHobbies);

    const hasChanges =
      selectedIds.length !== initialPredefinedIds.length ||
      selectedIds.some((id) => !initialPredefinedIds.includes(id)) ||
      customHobbies.length !== initialCustomNames.length ||
      customHobbies.some((n) => !initialCustomNames.includes(n));

    if (!hasChanges) {
      onClose();

      return;
    }

    setIsSaving(true);
    try {
      await Promise.all([
        hobbyService.updatePredefinedSelection(initialHobbies, selectedIds),
        hobbyService.updateCustomSelection(initialHobbies, customHobbies),
      ]);

      onClose();
      onSaved?.();
      auditService.triggerBackgroundSuggestionsRefresh();
    } catch (err) {
      console.error('[HobbiesSheet] failed to save hobbies', err);
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
          )}

          <PredefinedHobbyGrid selectedIds={selectedIds} onToggle={toggleHobby} />
        </View>
      </ScrollView>

      <SheetActions
        confirmLabel="Save"
        onConfirm={handleSave}
        onCancel={onClose}
        isConfirmDisabled={isSaving}
      />
    </BottomSheet>
  );
}
