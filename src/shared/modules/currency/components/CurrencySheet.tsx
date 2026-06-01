import { BottomSheet, Input, InputField, Spinner } from '@shared/components';
import { themeColor } from '@shared/constants';
import { Check } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { useCurrenciesSWR } from '../useCurrenciesSWR';

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

  const { currencies, isLoading: isCurrenciesLoading } = useCurrenciesSWR();

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  const data = useMemo(() => {
    const filtered =
      (search
        ? currencies?.filter(
            (c) =>
              c.code.toLowerCase().includes(search.toLowerCase()) ||
              c.name.toLowerCase().includes(search.toLowerCase()),
          )
        : currencies) ?? [];

    if (!pinnedCurrency) return filtered;

    return [
      ...filtered.filter((c) => c.code === pinnedCurrency),
      ...filtered.filter((c) => c.code !== pinnedCurrency),
    ];
  }, [search, pinnedCurrency, currencies]);

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
      {isCurrenciesLoading ? (
        <Spinner size="large" />
      ) : (
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
      )}
    </BottomSheet>
  );
}
