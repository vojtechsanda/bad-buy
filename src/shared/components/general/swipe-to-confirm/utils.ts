import * as Haptics from 'expo-haptics';

export const triggerHapticsTick = () => {
  Haptics.selectionAsync();
};

export const triggerHapticsSuccess = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};
