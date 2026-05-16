import { mockAccount } from '@features/account/store';
import {
  AuditPriceView,
  AuditStickyFooter,
  AuditSuggestionListView,
  AuditTimePriceView,
} from '@features/audit/components';
import { mockSuggestions } from '@features/audit/store';
import { convertFromUsd } from '@features/currency/utils';
import { mockFreezedItems } from '@features/vault/store';
import { CountdownPill, ScreenContainer } from '@shared/components';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function VaultItemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const suggestions = mockSuggestions;
  const item = mockFreezedItems.find((item) => item.id === id);
  const account = mockAccount;

  if (!item) {
    return <Redirect href="/(app)/vault" />;
  }

  const displayedPrice = convertFromUsd(
    item.price_usd,
    item.price_currency,
    item.conversion_rate_snapshot,
  );

  return (
    <ScreenContainer stickyBottom={<AuditStickyFooter freezeLabel="Re-freeze" />}>
      <View className="gap-8">
        <View className="gap-2">
          <AuditPriceView price={displayedPrice} currency={item.price_currency} />

          <View className="flex-row">
            {item.freeze_until && (
              <CountdownPill
                expiresAt={item.freeze_until}
                expiredLabel="Decision time"
                className="text-heading"
                formatExpireAtLabel={(label) => `Thaws in ${label}`}
              />
            )}
          </View>
        </View>

        <AuditTimePriceView
          price={displayedPrice}
          currency={item.price_currency}
          account={account}
        />

        <AuditSuggestionListView
          currency={item.price_currency}
          suggestions={suggestions}
          showRefresh={false}
        />
      </View>
    </ScreenContainer>
  );
}
