import { decimalPlacePrecision, themeColor } from '@shared/constants';
import { CurrencyCode } from '@shared/modules/currency';
import { ChevronDown } from 'lucide-react-native';
import { Pressable, Text, TextInput, View } from 'react-native';

type PriceInputProps = {
  value: string;
  onValueChange: (value: string) => void;
  currency: CurrencyCode;
  onCurrencyTap: () => void;
  autoFocus?: boolean;
};

// TODO: Use global input component when available
export function PriceInput({
  value,
  onValueChange,
  currency,
  onCurrencyTap,
  autoFocus = false,
}: PriceInputProps) {
  return (
    <View className="h-20 flex-row items-center rounded-lg border border-outline-200 bg-background-0 px-4">
      <TextInput
        style={{ flex: 1 }}
        className="h-full py-0 font-nunito-extrabold text-display-xl text-typography-900"
        value={value}
        onChangeText={onValueChange}
        onBlur={() => value && onValueChange(Number(value).toFixed(decimalPlacePrecision))}
        placeholder={Number(0).toFixed(decimalPlacePrecision)}
        placeholderTextColor={themeColor.typography400}
        keyboardType="decimal-pad"
        autoFocus={autoFocus}
        inputMode="numeric"
      />
      <Pressable
        onPress={onCurrencyTap}
        className="flex-row items-center gap-1 rounded-full bg-background-100 px-4 py-2"
      >
        <Text className="font-nunito-bold text-body-sm text-typography-900">{currency}</Text>
        <ChevronDown size={14} strokeWidth={1.75} color={themeColor.typography400} />
      </Pressable>
    </View>
  );
}
