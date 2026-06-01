import { useAccountSWR } from '@shared/modules/account';
import { currencyService, useConvertToUsd } from '@shared/modules/currency';
import { trackedItemService } from '@shared/services';
import { useFrozenItemsSWR, useTrackedItemsSWR } from '@shared/swr';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { AuditDecisionPayload, AuditFreezePayload, AuditReFreezePayload } from './types';

type UseAuditActionsParams = {
  onInvalidation?: () => void;
};

export function useAuditActions({ onInvalidation }: UseAuditActionsParams = {}) {
  const router = useRouter();

  const { convertToUsd } = useConvertToUsd();

  const { invalidateAccount } = useAccountSWR();
  const { invalidateTrackedItems } = useTrackedItemsSWR();
  const { invalidateFrozenItems } = useFrozenItemsSWR();

  const invalidateSWR = () => {
    invalidateTrackedItems(undefined, { revalidate: true });
    invalidateFrozenItems(undefined, { revalidate: true });
    invalidateAccount(undefined, { revalidate: true });
    onInvalidation?.();
  };

  const handleSkip = async ({ price, currency, suggestions }: AuditDecisionPayload) => {
    try {
      const rate = await currencyService.getRate(currency);

      await trackedItemService.recordDecision(
        {
          price_currency: currency,
          price_usd: convertToUsd(price, currency, rate),
          conversion_rate_snapshot: rate,
          suggestions,
        },
        'skipped',
      );

      await invalidateSWR();

      router.push({
        pathname: '/(app)/skip',
        params: { price, currency },
      });
    } catch (e) {
      console.error(JSON.stringify(e));

      Alert.alert('Error', "Couldn't apply the skip choice, please try again later.");
    }
  };

  const handleBuy = async ({ price, currency, suggestions }: AuditDecisionPayload) => {
    try {
      const rate = await currencyService.getRate(currency);

      await trackedItemService.recordDecision(
        {
          price_currency: currency,
          price_usd: convertToUsd(price, currency, rate),
          conversion_rate_snapshot: rate,
          suggestions,
        },
        'bought',
      );

      await invalidateSWR();

      router.push('/(app)/buy');
    } catch (e) {
      console.error(JSON.stringify(e));
      Alert.alert('Error', "Couldn't apply the buy choice, please try again later.");
    }
  };

  const handleFreeze = async ({
    price,
    currency,
    name,
    durationMs,
    suggestions,
  }: AuditFreezePayload) => {
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

      await invalidateSWR();

      router.push('/(app)/vault');
    } catch (e) {
      console.error(JSON.stringify(e));

      Alert.alert('Error', "Couldn't freeze the decision, please try again later.");
    }
  };

  const handleReFreeze = async ({ trackedItemId, durationMs }: AuditReFreezePayload) => {
    try {
      const freezeUntil = new Date(Date.now() + durationMs).toISOString();

      await trackedItemService.refreeze(trackedItemId, { freeze_until: freezeUntil });

      await invalidateSWR();

      router.push('/(app)/vault');
    } catch (e) {
      console.error(JSON.stringify(e));

      Alert.alert('Error', "Couldn't re-freeze the decision, please try again later.");
    }
  };

  return {
    handleBuy,
    handleFreeze,
    handleReFreeze,
    handleSkip,
  };
}
