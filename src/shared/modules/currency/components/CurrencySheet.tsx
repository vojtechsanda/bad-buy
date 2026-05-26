import { BottomSheet, Input, InputField } from '@shared/components';
import { themeColor } from '@shared/constants';
import { currencyService } from '@shared/modules/currency/currencyService';
import { type Currency } from '@shared/types';
import { Check } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

type CurrencySheetProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: string;
  onSelect: (code: string) => void;
  currencies?: Currency[];
  pinnedCurrency?: string;
};

export function CurrencySheet({
  isOpen,
  onClose,
  selectedCurrency,
  onSelect,
  currencies,
  pinnedCurrency,
}: CurrencySheetProps) {
  const [search, setSearch] = useState('');
  const [fetchedCurrencies, setFetchedCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    if (!currencies) {
      currencyService.listCurrencies().then(setFetchedCurrencies);
    }
  }, [currencies]);

  const resolvedCurrencies = currencies ?? fetchedCurrencies;

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  const data = useMemo(() => {
    const filtered = search
      ? resolvedCurrencies.filter(
          (c) =>
            c.code.toLowerCase().includes(search.toLowerCase()) ||
            c.name.toLowerCase().includes(search.toLowerCase()),
        )
      : resolvedCurrencies;

    if (!pinnedCurrency) return filtered;

    return [
      ...filtered.filter((c) => c.code === pinnedCurrency),
      ...filtered.filter((c) => c.code !== pinnedCurrency),
    ];
  }, [search, pinnedCurrency, resolvedCurrencies]);

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
