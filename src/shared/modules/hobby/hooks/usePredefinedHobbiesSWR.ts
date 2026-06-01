import { predefinedHobbyService } from '@shared/modules/hobby/predefinedHobbyService';
import useSWR from 'swr';

export const predefinedHobbiesSWRKey = 'predefined-hobbies';

export function usePredefinedHobbiesSWR() {
  const { data, error, isLoading, mutate } = useSWR(
    predefinedHobbiesSWRKey,
    predefinedHobbyService.listGroupedByCategory,
  );

  return {
    hobbiesByCategory: data ?? {},
    isLoading,
    error,
    invalidatePredefinedHobbies: mutate,
  };
}
