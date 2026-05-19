import { DimensionValue, View } from 'react-native';

export function SkeletonBar({ width, height = 16 }: { width: DimensionValue; height?: number }) {
  return <View className="rounded-md bg-outline-200" style={{ width, height }} />;
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
            <SkeletonBar width={36} height={36} />
            <SkeletonBar width="60%" height={18} />
          </View>
          <SkeletonBar width={56} />
        </View>
      ))}
    </View>
  );
}
