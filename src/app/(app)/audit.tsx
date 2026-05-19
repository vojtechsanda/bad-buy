import { mockAccount } from '@features/account';
import { ScreenContainer } from '@shared/components';
import {
  AuditPriceView,
  AuditStickyFooter,
  AuditSuggestionListView,
  AuditTimePriceView,
  mockSuggestions,
} from '@shared/modules/audit';
import { CurrencyCode } from '@shared/modules/currency';
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
