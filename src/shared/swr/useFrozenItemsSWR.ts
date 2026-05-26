import { trackedItemService } from '@shared/services/trackedItemService';
import useSWR from 'swr';

export const frozenItemsSWRKey = 'frozen-items';

export function useFrozenItemsSWR() {
  const { data, error, isLoading, mutate } = useSWR(
    frozenItemsSWRKey,
    trackedItemService.listFrozen,
  );

  return {
    frozenItems: data,
    isLoading,
    error,
    invalidateFrozenItems: mutate,
  };
}
