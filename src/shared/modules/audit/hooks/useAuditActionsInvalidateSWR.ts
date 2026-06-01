import { useAccountSWR } from '@shared/modules/account';
import { useFrozenItemsSWR, useTrackedItemsSWR } from '@shared/swr';

export function useAuditActionsInvalidateSWR(onInvalidation?: () => void) {
  const { invalidateTrackedItems } = useTrackedItemsSWR();
  const { invalidateFrozenItems } = useFrozenItemsSWR();
  const { invalidateAccount } = useAccountSWR();

  const invalidate = async () => {
    await Promise.all([
      invalidateTrackedItems(undefined, { revalidate: true }),
      invalidateFrozenItems(undefined, { revalidate: true }),
      invalidateAccount(undefined, { revalidate: true }),
    ]);
    onInvalidation?.();
  };

  return invalidate;
}
