import { FullSizeError, FullSizeSpinner, ScreenContainer } from '@shared/components';
import { useAccountSWR } from '@shared/modules/account';
import {
  AuditPriceView,
  AuditStickyFooter,
  AuditSuggestionListView,
  AuditTimePriceView,
  mockSuggestions,
} from '@shared/modules/audit';
import {
  CurrencyCode,
  convertToUsd,
  currencyService,
  mockExchangeRates,
} from '@shared/modules/currency';
import { NewDecisionInput, trackedItemService } from '@shared/services';
import { useFrozenItemsSWR, useTrackedItemsSWR } from '@shared/swr';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, View } from 'react-native';

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
              console.error(JSON.stringify(e));

              Alert.alert('Error', "Couldn't apply the skip choice, please try again later.");
            }
          }}
          onBuy={async () => {
            try {
              await trackedItemService.recordDecision(decisionPayload, 'bought');

              invalidateSWR();

              router.push('/(app)/buy');
            } catch (e) {
              console.error(JSON.stringify(e));
              Alert.alert('Error', "Couldn't apply the buy choice, please try again later.");
            }
          }}
          onFreeze={async (name, durationMs) => {
            try {
              const rate = await currencyService.getRate(currency);
              const freezeUntil = new Date(Date.now() + durationMs).toISOString();

              await trackedItemService.freeze({
                conversion_rate_snapshot: rate,
                freeze_until: freezeUntil,
                name,
                price_currency: currency,
                price_usd: convertToUsd(price, currency, rate),
                suggestions,
              });

              invalidateSWR();

              router.push('/(app)/vault');
            } catch (e) {
              console.error(JSON.stringify(e));

              Alert.alert('Error', "Couldn't freeze the decision, please try again later.");
            }
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
