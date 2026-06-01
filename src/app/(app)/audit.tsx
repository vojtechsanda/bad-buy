import { FullSizeError, FullSizeSpinner, ScreenContainer } from '@shared/components';
import { useAccountSWR } from '@shared/modules/account';
import {
  AuditPriceView,
  AuditStickyFooter,
  AuditSuggestionListView,
  AuditTimePriceView,
  mockSuggestions,
  useAuditActions,
} from '@shared/modules/audit';
import { CurrencyCode } from '@shared/modules/currency';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function AuditScreen() {
  const { price, currency } = useLocalSearchParams<{ price: string; currency: CurrencyCode }>();

  const { account, isLoading } = useAccountSWR();

  const { handleBuy, handleFreeze, handleSkip } = useAuditActions();

  if (isLoading) return <FullSizeSpinner />;
  if (!account) return <FullSizeError message="Unable to load profile, please try again later" />;

  const suggestions = mockSuggestions;

  if (!price || !currency) {
    return <Redirect href="/(app)/home" />;
  }

  return (
    <ScreenContainer
      stickyBottom={
        <AuditStickyFooter
          onSkip={async () => handleSkip({ price, currency, suggestions })}
          onBuy={async () => handleBuy({ price, currency, suggestions })}
          onFreeze={async (name, durationMs) =>
            handleFreeze({ price, currency, name, durationMs, suggestions })
          }
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
