import { useVaultItemSWR } from '@features/vault';
import { CountdownPill, FullSizeError, FullSizeSpinner, ScreenContainer } from '@shared/components';
import { useAccountSWR } from '@shared/modules/account';
import {
  AuditPriceView,
  AuditStickyFooter,
  AuditSuggestionListView,
  AuditTimePriceView,
  useAuditLateActions,
} from '@shared/modules/audit';
import { useConvertFromUsd } from '@shared/modules/currency';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function VaultItemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { convertFromUsd } = useConvertFromUsd();

  const { vaultItem, isLoading: isVaultItemLoading, invalidateVaultItem } = useVaultItemSWR(id);
  const { account, isLoading: isAccountLoading } = useAccountSWR();

  const { handleLateBuy, handleReFreeze, handleLateSkip } = useAuditLateActions({
    trackedItemId: id,
    onInvalidation: () => invalidateVaultItem(),
  });

  if (isVaultItemLoading || isAccountLoading) return <FullSizeSpinner />;
  if (!vaultItem || !account) {
    return <FullSizeError message="Unable to load vault detail, please try again later" />;
  }

  const displayedPrice = convertFromUsd(
    vaultItem.price_usd,
    vaultItem.price_currency,
    vaultItem.conversion_rate_snapshot,
  );

  return (
    <ScreenContainer
      stickyBottom={
        <AuditStickyFooter
          onSkip={() =>
            handleLateSkip({
              price: displayedPrice,
              currency: vaultItem.price_currency,
            })
          }
          onBuy={handleLateBuy}
          onFreeze={(name, durationMs) =>
            handleReFreeze({ trackedItemId: vaultItem.id, durationMs, name })
          }
          freezeLabel="Re-freeze"
          freezeSheetProps={{
            title: 'Re-freeze this decision',
            actionLabel: 'Re-freeze it',
            initialName: vaultItem.name ?? '',
          }}
        />
      }
    >
      <View className="gap-8">
        <View className="gap-2">
          <AuditPriceView price={displayedPrice} currency={vaultItem.price_currency} />

          <View className="flex-row">
            {vaultItem.freeze_until && (
              <CountdownPill
                expiresAt={vaultItem.freeze_until}
                expiredLabel="Decision time"
                className="text-heading"
                formatExpireAtLabel={(label) => `Thaws in ${label}`}
              />
            )}
          </View>
        </View>

        <AuditTimePriceView
          price={displayedPrice}
          currency={vaultItem.price_currency}
          account={account}
        />

        <AuditSuggestionListView
          currency={vaultItem.price_currency}
          suggestions={vaultItem.suggestions}
          showRefresh={false}
        />
      </View>
    </ScreenContainer>
  );
}
