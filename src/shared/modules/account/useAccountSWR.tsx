import useSWR from 'swr';

import { accountService } from './accountService';

export const accountSWRKey = 'account/detail';

export function useAccountSWR() {
  const { data, error, isLoading, mutate } = useSWR(accountSWRKey, accountService.get);

  return {
    account: data,
    isLoading,
    isError: error,
    invalidateAccount: mutate,
  };
}
