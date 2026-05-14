import { useAuth } from '@features/auth/hooks/useAuth';
import { AppTabs, AppTopBar } from '@shared/components';
import { Redirect } from 'expo-router';

export default function AppLayout() {
  const { isLogged, isLoading } = useAuth();

  // TODO: replace with loading screen
  if (isLoading) return null;

  if (!isLogged) {
    return <Redirect href="/(auth)/landing" />;
  }

  return <AppTabs header={({ options }) => <AppTopBar title={options.title} />} />;
}
