export type LevelInfo = {
  level: number;
  tier: string;
  nextLevel: number | null;
  nextTier: string | null;
  decisionsToNext: number | null;
  progressInLevel: number;
};
