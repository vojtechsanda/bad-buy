import { BottomSheet, Input, InputField } from '@shared/components';
import { countryToCurrency } from '@shared/utils';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, Text } from 'react-native';

const flagEmoji = (iso2: string): string => {
  const points = iso2
    .toUpperCase()
    .split('')
    .map((c) => c.charCodeAt(0) + 127397);

  return String.fromCodePoint(...points);
};

const getCountryName = (() => {
  try {
    const fmt = new Intl.DisplayNames(['en'], { type: 'region' });

    return (iso2: string) => fmt.of(iso2) ?? iso2;
  } catch {
    return (iso2: string) => iso2;
  }
})();

type Country = { iso2: string; name: string; flag: string };

const countries: Country[] = Object.keys(countryToCurrency)
  .map((iso2) => ({
    iso2,
    name: getCountryName(iso2),
    flag: flagEmoji(iso2),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

type CountrySheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iso2: string, name: string) => void;
};

export function CountrySheet({ isOpen, onClose, onSelect }: CountrySheetProps) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isOpen) setSearch('');
  }, [isOpen]);

  const filtered = useMemo(
    () =>
      search.length === 0
        ? countries
        : countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} heightMode={0.75}>
      <Text className="mb-4 font-nunito-bold text-heading text-typography-900">Select country</Text>
      <Input className="mb-4">
        <InputField
          placeholder="Search countries..."
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
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
