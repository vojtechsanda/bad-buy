import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, Text } from 'react-native';

import { BottomSheet } from '../../layout/bottom-sheet/BottomSheet';
import { Input, InputField } from '../../ui/input';

export type Country = { iso2: string; name: string; flag: string };

type CountrySheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iso2: string, name: string) => void;
  countries: Country[];
};

export function CountrySheet({ isOpen, onClose, onSelect, countries }: CountrySheetProps) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isOpen) setSearch('');
  }, [isOpen]);

  const filtered = useMemo(
    () =>
      search.length === 0
        ? countries
        : countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [search, countries],
  );

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} heightMode={0.75}>
      <Text className="mb-4 font-nunito-bold text-heading text-typography-900">Select country</Text>
      <Input size="3xl" className="mb-4">
        <InputField
          placeholder="Search countries..."
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
          className="text-xl"
        />
      </Input>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.iso2}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => {
              onSelect(item.iso2, item.name);
              onClose();
            }}
            className={`flex-row items-center gap-3 py-3.5 ${index > 0 ? 'border-t border-outline-100' : ''}`}
          >
            <Text className="text-xl">{item.flag}</Text>
            <Text className="font-nunito text-body text-typography-900">{item.name}</Text>
          </Pressable>
        )}
      />
    </BottomSheet>
  );
}
