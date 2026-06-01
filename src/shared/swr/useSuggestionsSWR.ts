import { fetchSuggestions } from '@shared/modules/audit/service';
import { useCallback, useState } from 'react';
import useSWR from 'swr';

export function suggestionsSWRKey(priceUsd: number) {
  return ['suggestions', priceUsd] as const;
}

export function useSuggestionsSWR(priceUsd?: number | null) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    priceUsd != null ? suggestionsSWRKey(priceUsd) : null,
    () => fetchSuggestions(priceUsd!, false),
  );

  const refresh = useCallback(async () => {
    if (priceUsd == null) return;

    setIsRefreshing(true);
    try {
      const fresh = await fetchSuggestions(priceUsd, true);
      await mutate(fresh, { revalidate: false });
    } catch (err) {
      console.warn('[useSuggestionsSWR] refresh failed — previous suggestions retained', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [mutate, priceUsd]);

  return {
    suggestions: data ?? [],
    isLoading: isLoading || isRefreshing,
    error,
    refresh,
  };
}
