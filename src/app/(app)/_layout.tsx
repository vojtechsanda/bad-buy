import { isLogged } from '@features/auth';
import { AppTabs, AppTopBar } from '@shared/components';
import { Redirect } from 'expo-router';

export default function AppLayout() {
  if (!isLogged) {
    return <Redirect href="/(auth)/landing" />;
  }

  return <AppTabs header={({ options }) => <AppTopBar title={options.title} />} />;
}
