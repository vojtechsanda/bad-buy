import { useAuth } from '@features/auth/hooks';
import { supabase } from '@shared/services/supabase';
import type { Account } from '@shared/types';
import { useEffect, useState } from 'react';

export function useAccount() {
  const { userId } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setAccount(null);
      setIsLoading(false);

      return;
    }

    let cancelled = false;
    setIsLoading(true);

    supabase
      .from('account')
      .select('*')
      .eq('id', userId)
      .single()
      .then(({ data }) => {
        if (!cancelled) {
          setAccount(data ?? null);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { account, isLoading };
}
