import { CurrencyCode } from '@features/currency/types';
import { formatPrice } from '@shared/utils';
import { Text, View } from 'react-native';

type AuditPriceViewProps = {
  price: string;
  currency: CurrencyCode;
};

export function AuditPriceView({ price, currency }: AuditPriceViewProps) {
  const displayPrice = formatPrice(parseFloat(price), currency);

  return (
    <View className="gap-1">
      <Text className="font-nunito-semibold text-caption uppercase tracking-widest text-typography-400">
        Price
      </Text>
      <Text className="font-nunito-bold text-display-lg text-typography-900">{displayPrice}</Text>
    </View>
  );
}
