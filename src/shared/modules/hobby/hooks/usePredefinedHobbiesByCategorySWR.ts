import { predefinedHobbyService } from '@shared/modules/hobby/predefinedHobbyService';
import useSWR from 'swr';

export const predefinedHobbiesByCategorySWRKey = 'predefined-hobbies-by-category';

export function usePredefinedHobbiesByCategorySWR() {
  const { data, error, isLoading, mutate } = useSWR(
    predefinedHobbiesByCategorySWRKey,
    predefinedHobbyService.listGroupedByCategory,
  );

  return {
    predefinedHobbiesByCategory: data,
    isLoading,
    error,
    invalidatePredefinedHobbiesByCategory: mutate,
  };
}
