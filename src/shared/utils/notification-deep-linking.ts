import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

function getVaultIdFromNotificationResponse(
  response: Notifications.NotificationResponse,
): string | undefined {
  return response.notification.request.content.data?.vaultId as string | undefined;
}

export function navigateToVaultFromNotification(
  response: Notifications.NotificationResponse,
): void {
  const vaultId = getVaultIdFromNotificationResponse(response);

  if (vaultId) {
    router.push({ pathname: '/(app)/vault/[id]', params: { id: vaultId } });
  }
}
