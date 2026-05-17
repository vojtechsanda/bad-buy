import { delay } from '@shared/utils';
import * as Haptics from 'expo-haptics';

export async function playCelebrationHaptics() {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
  await delay(50);

  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  await delay(90);

  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  await delay(70);
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);

  await delay(140);

  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  await delay(55);
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}
