import { FullSizeError, FullSizeSpinner, ScreenContainer } from '@shared/components';
import { useAccountSWR } from '@shared/modules/account';
import {
  AuditPriceView,
  AuditStickyFooter,
  AuditSuggestionListView,
  AuditTimePriceView,
  mockSuggestions,
} from '@shared/modules/audit';
import { CurrencyCode, convertToUsd, mockExchangeRates } from '@shared/modules/currency';
import { NewDecisionInput, trackedItemService } from '@shared/services';
import { useFrozenItemsSWR, useTrackedItemsSWR } from '@shared/swr';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

export default function AuditScreen() {
  const router = useRouter();

  const { price, currency } = useLocalSearchParams<{ price: string; currency: CurrencyCode }>();

  const { account, isLoading } = useAccountSWR();

  const { invalidateTrackedItems } = useTrackedItemsSWR();
  const { invalidateFrozenItems } = useFrozenItemsSWR();
  const { invalidateAccount } = useAccountSWR();

  const invalidateSWR = () => {
    invalidateTrackedItems();
    invalidateFrozenItems();
    invalidateAccount();
  };

  if (isLoading) return <FullSizeSpinner />;
  if (!account) return <FullSizeError message="Unable to load profile, please try again later" />;

  const suggestions = mockSuggestions;

  if (!price || !currency) {
    return <Redirect href="/(app)/home" />;
  }

  const decisionPayload: NewDecisionInput = {
    conversion_rate_snapshot: mockExchangeRates[currency],
    price_currency: currency,
    price_usd: convertToUsd(price, currency),
    suggestions,
  };

  return (
    <ScreenContainer
      stickyBottom={
        <AuditStickyFooter
          onSkip={async () => {
            try {
              await trackedItemService.recordDecision(decisionPayload, 'skipped');

              invalidateSWR();

              router.push({
                pathname: '/(app)/skip',
                params: { price, currency },
              });
            } catch (e) {
              console.error('Error:', JSON.stringify(e));
            }
          }}
          onBuy={async () => {
            try {
              await trackedItemService.recordDecision(decisionPayload, 'bought');

              invalidateSWR();

              router.push('/(app)/buy');
            } catch (e) {
              console.error('Error:', JSON.stringify(e));
            }
          }}
          onFreeze={() => {
            // TODO: Open freeze sheet and based on that freeze
            invalidateSWR();
          }}
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
