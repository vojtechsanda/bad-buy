import { trackedItemService } from '@shared/services/trackedItemService';
import useSWR from 'swr';

export const getTrackedItemsSWRKey = (id: string) => `vault-item/${id}`;

export function useVaultItemSWR(id: string) {
  const { data, error, isLoading, mutate } = useSWR(getTrackedItemsSWRKey(id), async () => {
    const [trackedItem, suggestions] = await Promise.all([
      trackedItemService.getById(id),
      trackedItemService.getSuggestions(id),
    ]);

    return {
      ...trackedItem,
      suggestions,
    };
  });

  return {
    vaultItem: data,
    isLoading,
    error,
    invalidateVaultItem: mutate,
  };
}
