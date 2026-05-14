import { useAuth } from '@features/auth/hooks';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isLogged, isLoading } = useAuth();

  // TODO(#127): replace with loading screen
  if (isLoading) return null;

  return <Redirect href={isLogged ? '/(app)/home' : '/(auth)/landing'} />;
}
