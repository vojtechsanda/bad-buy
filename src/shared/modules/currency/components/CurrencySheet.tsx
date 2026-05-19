import { themeColor } from '@shared/constants';
import { mockAvailableCurrencies } from '@shared/modules/currency';
import { Check } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { BottomSheet } from '../../../components/layout/bottom-sheet/BottomSheet';
import { Input, InputField } from '../../../components/ui/input';

type CurrencySheetProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: string;
  onSelect: (code: string) => void;
  pinnedCurrency?: string;
};

export function CurrencySheet({
  isOpen,
  onClose,
  selectedCurrency,
  onSelect,
  pinnedCurrency,
}: CurrencySheetProps) {
  const [search, setSearch] = useState('');

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  const data = useMemo(() => {
    const filtered = search
      ? mockAvailableCurrencies.filter(
          (c) =>
            c.code.toLowerCase().includes(search.toLowerCase()) ||
            c.name.toLowerCase().includes(search.toLowerCase()),
        )
      : mockAvailableCurrencies;

    if (!pinnedCurrency) return filtered;

    return [
      ...filtered.filter((c) => c.code === pinnedCurrency),
      ...filtered.filter((c) => c.code !== pinnedCurrency),
    ];
  }, [search, pinnedCurrency]);

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} heightMode={0.6}>
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
            key={item.code}
            onPress={() => {
              onSelect(item.code);
              handleClose();
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
