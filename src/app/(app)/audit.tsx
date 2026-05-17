import { mockAccount } from '@features/account/store';
import {
  AuditPriceView,
  AuditSuggestionListView,
  AuditTimePriceView,
} from '@features/audit/components';
import { AuditStickyFooter } from '@features/audit/components/AuditStickyFooter';
import { mockSuggestions } from '@features/audit/store';
import { CurrencyCode } from '@features/currency/types';
import { ScreenContainer } from '@shared/components';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

export default function AuditScreen() {
  const router = useRouter();

  const { price, currency } = useLocalSearchParams<{ price: string; currency: CurrencyCode }>();

  const account = mockAccount;
  const suggestions = mockSuggestions;

  if (!price || !currency) {
    return <Redirect href="/(app)/home" />;
  }

  return (
    <ScreenContainer
      stickyBottom={
        <AuditStickyFooter
          onSkip={() =>
            router.push({
              pathname: '/(app)/skip',
              params: { price, currency },
            })
          }
          onBuy={() => router.push('/(app)/buy')}
          onFreeze={() => {}}
        />
      }
    >
      <View className="gap-8">
        <AuditPriceView price={price} currency={currency} />

        <AuditTimePriceView price={price} currency={currency} account={account} />

        <AuditSuggestionListView currency={currency} suggestions={suggestions} />
      </View>
    </ScreenContainer>
  );
}
