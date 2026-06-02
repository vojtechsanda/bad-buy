import { navigateToVaultFromNotification } from '@shared/utils';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

/** Navigates to the vault item when the user taps a notification while the app is running. */
export function useNotificationResponseDeepLink(): void {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response: Notifications.NotificationResponse) => {
        navigateToVaultFromNotification(response);
      },
    );

    return () => subscription.remove();
  }, []);
}
