import { useAccount } from '@features/account/hooks';
import {
  AuditPriceView,
  AuditSuggestionListView,
  AuditTimePriceView,
} from '@features/audit/components';
import { AuditStickyFooter } from '@features/audit/components/AuditStickyFooter';
import { useSuggestions } from '@features/audit/hooks';
import { authService } from '@features/auth';
import { CurrencyCode } from '@features/currency/types';
import { convertToUsd } from '@features/currency/utils';
import { ScreenContainer } from '@shared/components';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function AuditScreen() {
  const { price, currency } = useLocalSearchParams<{ price: string; currency: CurrencyCode }>();

  const { account, isLoading: isAccountLoading } = useAccount();
  const priceUsd = price && currency ? convertToUsd(price, currency) : undefined;
  const { suggestions, isLoading, refresh } = useSuggestions(priceUsd);

  useEffect(() => {
    if (!isAccountLoading && account === null) {
      authService.signOut();
    }
  }, [isAccountLoading, account]);

  if (!price || !currency) {
    return <Redirect href="/(app)/home" />;
  }

  return (
    <ScreenContainer stickyBottom={<AuditStickyFooter />}>
      <View className="gap-8">
        <AuditPriceView price={price} currency={currency} />

        <AuditTimePriceView
          price={price}
          currency={currency}
          account={account}
          isLoading={isAccountLoading}
        />

        <AuditSuggestionListView
          currency={currency}
          suggestions={suggestions}
          isLoading={isLoading}
          onRefresh={refresh}
        />
      </View>
    </ScreenContainer>
  );
}
