import { useAuth } from '@features/auth';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isLoading } = useAuth();

  // TODO(#127): replace with loading screen
  if (isLoading) return null;

  // return <Redirect href={isLogged ? '/(app)/home' : '/(auth)/landing'} />;
  return <Redirect href={'/(onboarding)/onboarding'} />;
}
