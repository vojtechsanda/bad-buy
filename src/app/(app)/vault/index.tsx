import { VaultEmptyView, VaultSection } from '@features/vault';
import { FullSizeError, FullSizeSpinner, ScreenContainer } from '@shared/components';
import { useFrozenItemsSWR } from '@shared/swr/useFrozenItemsSWR';
import { View } from 'react-native';

export default function Vault() {
  const { frozenItems: vaultItems, isLoading } = useFrozenItemsSWR();

  if (isLoading) return <FullSizeSpinner />;
  if (!vaultItems) return <FullSizeError message="Unable to load vault, please try again later" />;

  // TODO: Make sure that items update their status when freeze_until time is reached, currently it only updates on re-render

  const now = new Date();
  const thawedItems = vaultItems.filter(
    (item) => item.freeze_until !== null && new Date(item.freeze_until!) <= now,
  );
  const frozenItems = vaultItems.filter(
    (item) => item.freeze_until !== null && new Date(item.freeze_until!) > now,
  );

  return (
    <ScreenContainer>
      {thawedItems.length + frozenItems.length === 0 ? (
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
