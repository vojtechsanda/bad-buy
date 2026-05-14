import { useAuthStore } from '../store';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  return {
    user,
    userId: user?.id ?? null,
    isLogged: user !== null,
    isLoading,
  };
}
