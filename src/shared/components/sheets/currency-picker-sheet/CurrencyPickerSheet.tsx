import { themeColor } from '@shared/constants';
import { Currency } from '@shared/types';
import { Check } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { BottomSheet } from '../../layout/bottom-sheet/BottomSheet';
import { Input, InputField } from '../../ui/input';

type CurrencyPickerSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  currencies: Currency[];
  selectedCurrency: string;
  onSelect: (code: string) => void;
  pinnedCurrency?: string;
};

export function CurrencyPickerSheet({
  isOpen,
  onClose,
  currencies,
  selectedCurrency,
  onSelect,
  pinnedCurrency,
}: CurrencyPickerSheetProps) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isOpen) setSearch('');
  }, [isOpen]);

  const data = useMemo(() => {
    const lower = search.toLowerCase();
    const filtered = search
      ? currencies.filter(
          (c) => c.code.toLowerCase().includes(lower) || c.name.toLowerCase().includes(lower),
        )
      : currencies;

    if (!pinnedCurrency) return filtered;

    const pinned = filtered.find((c) => c.code === pinnedCurrency);
    const rest = filtered.filter((c) => c.code !== pinnedCurrency);

    return pinned ? [pinned, ...rest] : filtered;
  }, [search, currencies, pinnedCurrency]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} heightMode={0.75}>
      <Text className="mb-4 font-nunito-bold text-heading text-typography-900">
        Select currency
      </Text>
      <Input size="3xl" className="mb-4">
        <InputField
          placeholder="Search currencies..."
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
          className="text-xl"
        />
      </Input>
      <FlatList
        data={data}
        keyExtractor={(item) => item.code}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => {
              onSelect(item.code);
              onClose();
            }}
            className={`flex-row items-center justify-between py-3.5 ${index > 0 ? 'border-t border-outline-100' : ''}`}
          >
            <View>
              <Text className="font-nunito-semibold text-body text-typography-900">
                {item.code}
              </Text>
              <Text className="font-nunito text-body-sm text-typography-400">{item.name}</Text>
            </View>
            {selectedCurrency === item.code && (
              <Check size={18} strokeWidth={2} color={themeColor.primary500} />
            )}
          </Pressable>
        )}
      />
    </BottomSheet>
  );
}
