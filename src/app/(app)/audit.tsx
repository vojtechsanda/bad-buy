import { FullSizeError, FullSizeSpinner, ScreenContainer } from '@shared/components';
import { useAccountSWR } from '@shared/modules/account';
import {
  AuditPriceView,
  AuditStickyFooter,
  AuditSuggestionListView,
  AuditTimePriceView,
  useAuditInitialActions,
  useSuggestions,
} from '@shared/modules/audit';
import { CurrencyCode, useConvertToUsd } from '@shared/modules/currency';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function AuditScreen() {
  const { price, currency } = useLocalSearchParams<{ price: string; currency: CurrencyCode }>();

  const { convertToUsd } = useConvertToUsd();
  const { account, isLoading: isAccountLoading } = useAccountSWR();
  const priceUsd = price && currency ? convertToUsd(price, currency) : undefined;
  const { suggestions, isLoading, refresh } = useSuggestions(priceUsd);

  const { handleBuy, handleFreeze, handleSkip } = useAuditInitialActions();

  if (isAccountLoading) return <FullSizeSpinner />;
  if (!account) return <FullSizeError message="Unable to load profile, please try again later" />;

  if (!price || !currency) {
    return <Redirect href="/(app)/home" />;
  }

  return (
    <ScreenContainer
      stickyBottom={
        <AuditStickyFooter
          onSkip={() => handleSkip({ price, currency, suggestions })}
          onBuy={() => handleBuy({ price, currency, suggestions })}
          onFreeze={(name, durationMs) =>
            handleFreeze({ price, currency, name, durationMs, suggestions })
          }
        />
      }
    >
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
