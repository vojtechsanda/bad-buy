import { currencyService, useConvertToUsd } from '@shared/modules/currency';
import { trackedItemService } from '@shared/services';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { useAuditActionsInvalidateSWR } from '../useAuditActionsInvalidateSWR';
import { AuditFreezePayload, AuditInitialDecisionPayload } from './types';

type useAuditInitialActionsParams = {
  onInvalidation?: () => void;
};

export function useAuditInitialActions({ onInvalidation }: useAuditInitialActionsParams = {}) {
  const router = useRouter();

  const { convertToUsd } = useConvertToUsd();

  const invalidateSWR = useAuditActionsInvalidateSWR(onInvalidation);

  const handleSkip = async ({ price, currency, suggestions }: AuditInitialDecisionPayload) => {
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

  const handleBuy = async ({ price, currency, suggestions }: AuditInitialDecisionPayload) => {
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

  return {
    handleBuy,
    handleFreeze,
    handleSkip,
  };
}
