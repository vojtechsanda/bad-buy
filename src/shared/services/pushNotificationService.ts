import { FREEZE_REMINDER_CHANNEL_ID } from '@shared/constants';
import * as Notifications from 'expo-notifications';
import { PermissionStatus } from 'expo-notifications';
import { Platform } from 'react-native';

export type NotificationPermissions = {
  status: PermissionStatus;
  canAskAgain: boolean;
};

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(FREEZE_REMINDER_CHANNEL_ID, {
    name: 'Freeze reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

async function getPermissionStatus(): Promise<NotificationPermissions> {
  const { status, canAskAgain } = await Notifications.getPermissionsAsync();

  return { status, canAskAgain };
}

async function requestPermission(): Promise<PermissionStatus> {
  const { status } = await Notifications.requestPermissionsAsync();

  return status;
}

async function scheduleFreezeNotification(itemId: string, freezeUntil: string): Promise<void> {
  try {
    const date = new Date(freezeUntil);
    if (date <= new Date()) return;

    await ensureAndroidChannel();

    const { status, canAskAgain } = await getPermissionStatus();
    let resolvedStatus = status;

    if (resolvedStatus === 'undetermined' || (resolvedStatus === 'denied' && canAskAgain)) {
      resolvedStatus = await requestPermission();
    }
    if (resolvedStatus !== 'granted') return;

    await Notifications.scheduleNotificationAsync({
      identifier: itemId,
      content: {
        title: 'Decision time',
        body: 'A frozen item is ready for your decision.',
        data: { vaultId: itemId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(freezeUntil),
        channelId: FREEZE_REMINDER_CHANNEL_ID,
      },
    });
  } catch {
    // Notification scheduling is best-effort — never block the core freeze action
  }
}

async function cancelFreezeNotification(itemId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(itemId);
  } catch (error) {
    console.error('[pushNotificationService] failed to cancel freeze notification:', itemId, error);
  }
}

export const pushNotificationService = {
  getPermissionStatus,
  requestPermission,
  scheduleFreezeNotification,
  cancelFreezeNotification,
};
