import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { confirmThreshold, hapticThresholds, knobInset, knobSize } from './constants';
import { triggerHapticsSuccess, triggerHapticsTick } from './utils';

type UseSwipeGesturePanParams = {
  trackWidth: number;
  onConfirm: () => void;
};

export function useSwipeGesture({ trackWidth, onConfirm }: UseSwipeGesturePanParams) {
  const translation = useSharedValue(0);
  const prevProgress = useSharedValue(0);
  const confirmed = useSharedValue(false);

  const maxTranslation = Math.max(0, trackWidth - knobSize - knobInset * 2);

  useFocusEffect(
    useCallback(() => {
      translation.value = 0;
      prevProgress.value = 0;
      confirmed.value = false;
    }, [confirmed, prevProgress, translation]),
  );

  const gesturePan = Gesture.Pan()
    .enabled(maxTranslation > 0)
    .onUpdate((event) => {
      // onUpdate runs when the gesture is in progress - user is swiping
      if (confirmed.value) return;

      const trimmedTranslation = Math.min(Math.max(event.translationX, 0), maxTranslation);
      translation.value = trimmedTranslation;

      const progress = trimmedTranslation / maxTranslation;

      for (const threshold of hapticThresholds) {
        const wasBelow = prevProgress.value < threshold;
        const isBelow = progress < threshold;

        if (wasBelow !== isBelow) {
          scheduleOnRN(triggerHapticsTick);
        }
      }

      prevProgress.value = progress;
    })
    .onEnd(() => {
      // onEnd runs when the gesture is finished - user is not touching the screen anymore
      if (confirmed.value) return;

      const progress = translation.value / maxTranslation;

      if (progress >= confirmThreshold) {
        confirmed.value = true;
        translation.value = withTiming(maxTranslation, { duration: 120 });

        scheduleOnRN(triggerHapticsSuccess);
        scheduleOnRN(onConfirm);
      } else {
        translation.value = withSpring(0, {
          damping: 18,
          stiffness: 180,
          overshootClamping: true,
        });

        prevProgress.value = 0;
      }
    });

  return {
    gesturePan,
    translation: translation.value,
  };
}
