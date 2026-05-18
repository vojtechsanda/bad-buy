export type LevelTier = 'Aware' | 'Mindful' | 'Intentional' | 'Zen';

export type LevelInfo = {
  level: number;
  tier: LevelTier;
  note: string;
  nextLevel: number | null;
  nextTier: LevelTier | null;
  decisionsToNext: number | null;
  progressInLevel: number;
};
