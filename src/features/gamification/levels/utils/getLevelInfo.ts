import { accountLevels } from '../constants';
import { LevelInfo } from '../types';

export function getCurrentLevelInfo(decisionCount: number): LevelInfo {
  const currentLevel =
    accountLevels.find(
      (level, index) =>
        index === accountLevels.length - 1 ||
        (level.threshold <= decisionCount && accountLevels[index + 1].threshold > decisionCount),
    ) ?? accountLevels[0];

  const nextLevel = accountLevels.find((level) => level.level === currentLevel.level + 1) ?? null;

  if (!nextLevel) {
    return {
      level: currentLevel.level,
      tier: currentLevel.tier,
      nextLevel: null,
      nextTier: null,
      decisionsToNext: null,
      progressInLevel: 1,
    };
  }

  return {
    level: currentLevel.level,
    tier: currentLevel.tier,
    nextLevel: nextLevel.level,
    nextTier: nextLevel.tier,
    decisionsToNext: nextLevel.threshold - decisionCount,
    progressInLevel: Math.max(
      0,
      (decisionCount - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold),
    ),
  };
}
