import { VaultEmptyView, VaultSection, mockFreezedItems } from '@features/vault';
import { ScreenContainer, StreamLoader } from '@shared/components';
import type { Stream, TrackedItem } from '@shared/types';
import { View } from 'react-native';

export default function Vault() {
  const stream: Stream<TrackedItem[]> = (onData) => {
    onData(mockFreezedItems);

    return () => {};
  };

  // TODO: Make sure that items update their status when freeze_until time is reached, currently it only updates on re-render

  return (
    <StreamLoader stream={stream} loadingMessage="Loading your vault...">
      {(items) => {
        const now = new Date();
        const thawedItems = items.filter(
          (item) => item.freeze_until !== null && new Date(item.freeze_until!) <= now,
        );
        const frozenItems = items.filter(
          (item) => item.freeze_until !== null && new Date(item.freeze_until!) > now,
        );

        return (
          <ScreenContainer>
            {items.length === 0 ? (
              <VaultEmptyView />
            ) : (
              <View className="gap-8">
                {thawedItems.length > 0 && <VaultSection title="Thawed" items={thawedItems} />}
                {frozenItems.length > 0 && <VaultSection title="Frozen" items={frozenItems} />}
              </View>
            )}
          </ScreenContainer>
        );
      }}
    </StreamLoader>
  );
}
