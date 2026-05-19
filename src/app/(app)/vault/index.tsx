import { VaultEmptyView, VaultSection, mockFreezedItems } from '@features/vault';
import { ScreenContainer } from '@shared/components';
import { View } from 'react-native';

export default function Vault() {
  const vaultItems = mockFreezedItems;
  const now = new Date();

  // TODO: Make sure that items update their status when freeze_until time is reached, currently it only updates on re-render

  const thawedItems = vaultItems.filter(
    (item) => item.freeze_until !== null && new Date(item.freeze_until!) <= now,
  );

  const frozenItems = vaultItems.filter(
    (item) => item.freeze_until !== null && new Date(item.freeze_until!) > now,
  );

  return (
    <ScreenContainer>
      {vaultItems.length === 0 ? (
        <VaultEmptyView />
      ) : (
        <View className="gap-8">
          {thawedItems.length > 0 && <VaultSection title="Thawed" items={thawedItems} />}
          {frozenItems.length > 0 && <VaultSection title="Frozen" items={frozenItems} />}
        </View>
      )}
    </ScreenContainer>
  );
}
