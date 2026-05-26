import { trackedItemService } from '@shared/services/trackedItemService';
import useSWR from 'swr';

export const trackedItemsSWRKey = 'tracked-items';

export function useTrackedItemsSWR() {
  const { data, error, isLoading, mutate } = useSWR(trackedItemsSWRKey, trackedItemService.list);

  return {
    trackedItems: data,
    isLoading,
    error,
    invalidateTrackedItems: mutate,
  };
}
