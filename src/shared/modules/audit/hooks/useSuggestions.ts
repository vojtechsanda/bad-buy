import { fetchSuggestions } from '@shared/modules/audit/service';
import type { AccountSuggestion } from '@shared/types';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useSuggestions(priceUsd?: number) {
  const [suggestions, setSuggestions] = useState<AccountSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const hasSuggestionsRef = useRef(false);

  const load = useCallback(
    async (forceRefresh = false) => {
      if (!forceRefresh || !hasSuggestionsRef.current) setIsLoading(true);
      setError(null);
      try {
        const data = await fetchSuggestions(priceUsd, forceRefresh);
        setSuggestions(data);
        hasSuggestionsRef.current = data.length > 0;
      } catch (err) {
        if (forceRefresh) {
          // TODO(frontend): show a toast "Couldn't refresh. Try again." once a Toast component is available.
          console.warn('[useSuggestions] refresh failed — previous suggestions retained', err);
        } else {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [priceUsd],
  );

  useEffect(() => {
    void load();
  }, [load]);

  /** Premium only: bypasses cache and triggers a fresh Gemini call. */
  const refresh = useCallback(() => {
    void load(true);
  }, [load]);

  return { suggestions, isLoading, error, refresh };
}
