import { useAuth } from '@features/auth';
import { FullSizeSpinner } from '@shared/components';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isLoading, isLogged } = useAuth();

  if (isLoading) return <FullSizeSpinner />;

  return <Redirect href={isLogged ? '/(app)/home' : '/(auth)/landing'} />;
}
