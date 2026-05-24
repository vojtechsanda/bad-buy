import { useStream } from '@shared/hooks/useStream';
import type { Stream } from '@shared/types/stream';
import { ReactNode } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

type StreamLoaderProps<T> = {
  stream: Stream<T>;
  children: (data: T) => ReactNode;
  loadingMessage?: string;
  errorBuilder?: (error: Error) => ReactNode;
};

export function StreamLoader<T>({
  stream,
  children,
  loadingMessage = 'Loading...',
  errorBuilder,
}: StreamLoaderProps<T>) {
  const { data, error, isLoading } = useStream(stream);

  if (error) {
    if (errorBuilder) return <>{errorBuilder(error)}</>;

    return (
      <View className="flex-1 items-center justify-center">
        <Text className="font-nunito text-body-sm text-error-700">{error.message}</Text>
      </View>
    );
  }

  if (isLoading || data === null) {
    return (
      <View className="flex-1 items-center justify-center gap-4">
        <ActivityIndicator />
        {loadingMessage ? (
          <Text className="font-nunito text-body-sm text-typography-600">{loadingMessage}</Text>
        ) : null}
      </View>
    );
  }

  return <>{children(data)}</>;
}
