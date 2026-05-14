import { useAuthContext } from '../AuthProvider';

export function useAuth() {
  const { user, isLoading } = useAuthContext();

  return {
    user,
    userId: user?.id ?? null,
    isLogged: user !== null,
    isLoading,
  };
}
