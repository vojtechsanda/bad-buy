import { COLD_START_NOTIFICATION_MAX_AGE_S } from '@shared/constants';
import { navigateToVaultFromNotification } from '@shared/utils';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';

/** Handles a notification tap that launched a cold start, within a recent time window. */
export function useColdStartNotificationDeepLink(isReady: boolean): void {
  const hasHandled = useRef(false);

  useEffect(() => {
    if (!isReady || hasHandled.current) return;

    hasHandled.current = true;

    const response = Notifications.getLastNotificationResponse();
    if (!response) return;

    const tappedAt = response.notification.date;
    const isRecent = Date.now() - tappedAt < COLD_START_NOTIFICATION_MAX_AGE_S * 1000;
    if (!isRecent) return;

    navigateToVaultFromNotification(response);
  }, [isReady]);
}
