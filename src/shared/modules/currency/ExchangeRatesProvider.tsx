import { type ReactNode, useEffect } from 'react';

import { currencyService } from './currencyService';
import { useExchangeRatesStore } from './store';

export function ExchangeRatesProvider({ children }: { children: ReactNode }) {
  const setRates = useExchangeRatesStore((s) => s.setRates);
  const setLoading = useExchangeRatesStore((s) => s.setLoading);

  useEffect(() => {
    let mounted = true;

    currencyService
      .listExchangeRates()
      .then((rates) => {
        if (!mounted) return;
        setRates(rates);
      })
      .catch((error) => {
        console.error('[ExchangeRatesProvider] failed to load exchange rates:', error);
        if (!mounted) return;
        setRates([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [setRates, setLoading]);

  return <>{children}</>;
}
