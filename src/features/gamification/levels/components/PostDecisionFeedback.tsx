import { TrackedItem } from '@shared/types';
import { Text, View } from 'react-native';

import { LevelTier } from '../types';
import { getCurrentLevelInfo } from '../utils';

type PostDecisionFeedbackProps = {
  allDecisions: TrackedItem[];
};

export function PostDecisionFeedback({ allDecisions }: PostDecisionFeedbackProps) {
  const levelInfo = getCurrentLevelInfo(allDecisions.length);
  const isLevelUp = levelInfo.progressInLevel === 0;

  const badgeColorClassMap: Record<LevelTier, string> = {
    Aware: 'bg-primary-300',
    Mindful: 'bg-primary-500',
    Intentional: 'bg-accent-500',
    Zen: 'bg-yellow-400',
  };

  if (!isLevelUp) {
    return (
      <Text className="text-center font-nunito text-body text-typography-400">Decision +1</Text>
    );
  }

  return (
    <View className="flex-row items-center gap-3 rounded-lg bg-background-100 p-5">
      <View
        className={`h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${badgeColorClassMap[levelInfo.tier]}`}
      >
        <Text className="text-display-sm font-nunito-bold text-typography-0">
          {levelInfo.level}
        </Text>
      </View>
      <View className="flex-1" style={{ minWidth: 0 }}>
        <Text className="font-nunito-semibold text-body text-typography-900">
          Level up! You're now L{levelInfo.level} — {levelInfo.tier}
        </Text>
        <Text className="font-nunito-semibold text-caption text-typography-400">
          {levelInfo.note}
        </Text>
      </View>
    </View>
  );
}
