import { hobbyService } from '@shared/modules/account';
import useSWR from 'swr';

export const hobbiesSWRKey = 'account-hobbies';

export function useHobbiesSWR() {
  const { data, error, isLoading, mutate } = useSWR(hobbiesSWRKey, hobbyService.list);

  return {
    hobbies: data,
    isLoading,
    error,
    invalidateHobbies: mutate,
  };
}
