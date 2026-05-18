import { themeColor } from '@shared/constants';
import { Currency } from '@shared/types';
import { Check } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BottomSheet } from '../../layout/bottom-sheet/BottomSheet';
import { Input, InputField } from '../../ui/input';

type CurrencySheetProps = {
  isOpen: boolean;
  onClose: () => void;
  currencies: Currency[];
  selectedCurrency: string;
  onSelect: (code: string) => void;
  pinnedCurrency?: string;
  withSearch?: boolean;
};

export function CurrencySheet({
  isOpen,
  onClose,
  currencies,
  selectedCurrency,
  onSelect,
  pinnedCurrency,
  withSearch,
}: CurrencySheetProps) {
  const [search, setSearch] = useState('');

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  const data = useMemo(() => {
    const filtered =
      withSearch && search
        ? currencies.filter(
            (c) =>
              c.code.toLowerCase().includes(search.toLowerCase()) ||
              c.name.toLowerCase().includes(search.toLowerCase()),
          )
        : currencies;

    if (!pinnedCurrency) return filtered;

    return [
      ...filtered.filter((c) => c.code === pinnedCurrency),
      ...filtered.filter((c) => c.code !== pinnedCurrency),
    ];
  }, [currencies, search, withSearch, pinnedCurrency]);

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} heightMode={0.6}>
      <Text className="mb-4 font-nunito-bold text-heading text-typography-900">
        Select currency
      </Text>
      {withSearch && (
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
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        {data.map((currency, index) => (
          <Pressable
            key={currency.code}
            onPress={() => {
              onSelect(currency.code);
              handleClose();
            }}
            className={`flex-row items-center justify-between py-3.5 ${index > 0 ? 'border-t border-outline-100' : ''}`}
          >
            <View>
              <Text className="font-nunito-semibold text-body text-typography-900">
                {currency.code}
              </Text>
              <Text className="font-nunito text-body-sm text-typography-400">{currency.name}</Text>
            </View>
            {selectedCurrency === currency.code && (
              <Check size={18} strokeWidth={2} color={themeColor.primary500} />
            )}
          </Pressable>
        ))}
      </ScrollView>
    </BottomSheet>
  );
}
