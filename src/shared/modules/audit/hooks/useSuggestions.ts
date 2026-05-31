import { fetchSuggestions } from '@shared/modules/audit/service';
import type { AccountSuggestion } from '@shared/types';
import { useCallback, useEffect, useState } from 'react';

export function useSuggestions(priceUsd?: number) {
  const [suggestions, setSuggestions] = useState<AccountSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSuggestions(priceUsd, false);
      setSuggestions(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [priceUsd]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Premium only: bypasses the server-side cache and triggers a fresh Gemini call. */
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchSuggestions(priceUsd, true);
      setSuggestions(data);
    } catch (err) {
      console.warn('[useSuggestions] refresh failed — previous suggestions retained', err);
    } finally {
      setIsLoading(false);
    }
  }, [priceUsd]);

  return { suggestions, isLoading, error, refresh };
}
