import { Skeleton } from '@shared/components/ui';
import { DimensionValue } from 'react-native';

type SkeletonBarProps = { width: DimensionValue; height?: number };

export function SkeletonBar({ width, height = 16 }: SkeletonBarProps) {
  return <Skeleton variant="rounded" style={{ width, height }} />;
}
