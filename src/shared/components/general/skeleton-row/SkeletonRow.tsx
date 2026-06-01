import { Skeleton } from '@shared/components/ui/skeleton';
import { DimensionValue, View } from 'react-native';

export function SkeletonBar({ width, height = 16 }: { width: DimensionValue; height?: number }) {
  return <Skeleton variant="rounded" style={{ width, height }} />;
}

export function SkeletonRowList({ count = 5 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }, (_, index) => (
        <View
          key={index}
          className={`flex-row items-center justify-between gap-4 py-3 ${index > 0 ? 'border-t border-outline-100' : ''}`}
        >
          <View className="flex-1 flex-row items-center gap-3" style={{ minWidth: 0 }}>
            <Skeleton variant="rounded" style={{ width: 36, height: 36 }} />
            <Skeleton variant="rounded" className="h-[18px]" style={{ flex: 1, maxWidth: '60%' }} />
          </View>
          <Skeleton variant="rounded" style={{ width: 56, height: 16 }} />
        </View>
      ))}
    </View>
  );
}
