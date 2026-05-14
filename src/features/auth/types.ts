import type { User } from '@supabase/supabase-js';

export type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
};
