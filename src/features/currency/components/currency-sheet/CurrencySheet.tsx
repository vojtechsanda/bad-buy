import { mockAvailableCurrencies } from '@features/currency/store';
import { CurrencyCode } from '@features/currency/types';
import { BottomSheet } from '@shared/components';
import { themeColor } from '@shared/constants';
import { Check } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

type CurrencySheetProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: CurrencyCode;
  onSelect: (currencyCode: CurrencyCode) => void;
};

export function CurrencySheet({ isOpen, onClose, selectedCurrency, onSelect }: CurrencySheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} heightMode={0.6}>
      <Text className="mb-4 font-nunito-bold text-heading text-typography-900">
        Select currency
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {mockAvailableCurrencies.map((currency, index) => (
          <Pressable
            key={currency.target}
            onPress={() => onSelect(currency.target)}
            className={`flex-row items-center justify-between py-3.5 ${index > 0 ? 'border-t border-outline-100' : ''}`}>
            <View>
              <Text className="font-nunito-semibold text-body text-typography-900">
                {currency.target}
              </Text>
              <Text className="font-nunito text-body-sm text-typography-400">{currency.name}</Text>
            </View>
            {selectedCurrency === currency.target && (
              <Check size={18} strokeWidth={2} color={themeColor.primary500} />
            )}
          </Pressable>
        ))}
      </ScrollView>
    </BottomSheet>
  );
}
