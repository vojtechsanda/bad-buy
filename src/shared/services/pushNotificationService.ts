import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

type PermissionStatus = 'granted' | 'denied' | 'undetermined';

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('freeze-reminders', {
    name: 'Freeze reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

async function getPermissionStatus(): Promise<PermissionStatus> {
  const { status } = await Notifications.getPermissionsAsync();

  return status as PermissionStatus;
}

async function requestPermission(): Promise<'granted' | 'denied'> {
  await ensureAndroidChannel();
  const { status } = await Notifications.requestPermissionsAsync();

  return status === 'granted' ? 'granted' : 'denied';
}

async function scheduleFreezeNotification(itemId: string, freezeUntil: string): Promise<void> {
  const status = await getPermissionStatus();
  if (status !== 'granted') return;

  await ensureAndroidChannel();
  await Notifications.scheduleNotificationAsync({
    identifier: itemId,
    content: {
      title: 'Decision time',
      body: 'A frozen item is ready for your decision.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(freezeUntil),
      channelId: 'freeze-reminders',
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

// TODO (#112): Wire addNotificationResponseReceivedListener in the root layout
// to route the user to /(app)/vault/[id] when they tap a push notification.

export const pushNotificationService = {
  getPermissionStatus,
  requestPermission,
  scheduleFreezeNotification,
  cancelFreezeNotification,
};
