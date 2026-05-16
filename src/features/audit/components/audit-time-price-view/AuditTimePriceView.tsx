import { CurrencyCode } from '@features/currency/types';
import { convertToUsd } from '@features/currency/utils';
import { Account } from '@shared/types';
import { Text, View } from 'react-native';

import { getTimePrice, getTimePriceNote } from './utils';

type AuditTimePriceViewProps = {
  price: number | string;
  currency: CurrencyCode;
  account: Account;
};

export function AuditTimePriceView({ price, currency, account }: AuditTimePriceViewProps) {
  const priceUsd = convertToUsd(price, currency);

  const workHours = priceUsd / account.hourly_wage_usd;

  return (
    <View className="items-center gap-2 rounded-lg bg-background-100 px-6 py-8">
      <Text className="font-nunito-extrabold text-5xl text-typography-900">
        {getTimePrice(workHours)}
      </Text>
      <Text className="font-nunito text-body text-typography-600">
        {getTimePriceNote(workHours)}
      </Text>
    </View>
  );
}
