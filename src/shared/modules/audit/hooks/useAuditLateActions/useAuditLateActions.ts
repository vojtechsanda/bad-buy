import { trackedItemService } from '@shared/services';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { useAuditActionsInvalidateSWR } from '../useAuditActionsInvalidateSWR';
import { AuditLateSkipDecisionPayload, AuditReFreezePayload } from './types';

type useAuditLateActionsParams = {
  trackedItemId: string;
  onInvalidation?: () => void;
};

export function useAuditLateActions({ trackedItemId, onInvalidation }: useAuditLateActionsParams) {
  const router = useRouter();

  const invalidateSWR = useAuditActionsInvalidateSWR(onInvalidation);

  const handleLateSkip = async ({ price, currency }: AuditLateSkipDecisionPayload) => {
    try {
      await trackedItemService.decide(trackedItemId, 'skipped');

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

  const handleLateBuy = async () => {
    try {
      await trackedItemService.decide(trackedItemId, 'bought');

      await invalidateSWR();

      router.push('/(app)/buy');
    } catch (e) {
      console.error(JSON.stringify(e));
      Alert.alert('Error', "Couldn't apply the buy choice, please try again later.");
    }
  };

  const handleReFreeze = async ({ trackedItemId, name, durationMs }: AuditReFreezePayload) => {
    try {
      const freezeUntil = new Date(Date.now() + durationMs).toISOString();

      await trackedItemService.refreeze(trackedItemId, { freeze_until: freezeUntil, name });

      await invalidateSWR();

      router.push('/(app)/vault');
    } catch (e) {
      console.error(JSON.stringify(e));

      Alert.alert('Error', "Couldn't re-freeze the decision, please try again later.");
    }
  };

  return {
    handleLateBuy,
    handleReFreeze,
    handleLateSkip,
  };
}
