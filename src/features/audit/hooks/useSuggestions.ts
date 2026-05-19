import { fetchSuggestions } from '@features/audit/service';
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
      const data = await fetchSuggestions(priceUsd);
      setSuggestions(data);
    } catch (err) {
      console.warn('[useSuggestions] failed', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [priceUsd]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Premium: new Gemini run each tap. Free: may still return cached DB rows. */
  const refresh = useCallback(() => {
    void load();
  }, [load]);

  return { suggestions, isLoading, error, refresh };
}
