import { PermissionStatus } from 'expo-notifications';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { FREEZE_REMINDER_CHANNEL_ID } from './pushNotificationConstants';

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(FREEZE_REMINDER_CHANNEL_ID, {
    name: 'Freeze reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

async function getPermissionStatus(): Promise<PermissionStatus> {
  const { status } = await Notifications.getPermissionsAsync();

  return status;
}

async function requestPermission(): Promise<PermissionStatus> {
  const { status } = await Notifications.requestPermissionsAsync();

  return status;
}

async function scheduleFreezeNotification(itemId: string, freezeUntil: string): Promise<void> {
  const date = new Date(freezeUntil);
  if (date <= new Date()) return;

  await ensureAndroidChannel();

  let status = await getPermissionStatus();
  if (status === 'undetermined') {
    status = await requestPermission();
  }
  if (status !== 'granted') return;

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
}

async function cancelFreezeNotification(itemId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(itemId);
  } catch {
    // Notification may have already fired — ignore
  }
}

export const pushNotificationService = {
  getPermissionStatus,
  requestPermission,
  scheduleFreezeNotification,
  cancelFreezeNotification,
};
