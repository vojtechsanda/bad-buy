import { CurrencyCode } from '@shared/modules/currency/types';
import { formatPrice } from '@shared/utils';
import { Text, View } from 'react-native';

type AuditPriceViewProps = {
  price: number | string;
  currency: CurrencyCode;
};

export function AuditPriceView({ price, currency }: AuditPriceViewProps) {
  const displayPrice = formatPrice(price, currency);

  return (
    <View className="gap-1">
      <Text className="font-nunito-semibold text-caption uppercase tracking-widest text-typography-400">
        Price
      </Text>
      <Text className="font-nunito-bold text-display-lg text-typography-900">{displayPrice}</Text>
    </View>
  );
}
