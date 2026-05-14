import { useAuth } from '@features/auth/hooks';
import { AppTabs, AppTopBar } from '@shared/components';
import { Redirect, Tabs } from 'expo-router';

export default function AppLayout() {
  const { isLogged, isLoading } = useAuth();

  // TODO(#127): replace with loading screen
  if (isLoading) return null;

  if (!isLogged) {
    return <Redirect href="/(auth)/landing" />;
  }

  return (
    <AppTabs
      header={({ options }) => <AppTopBar title={options.title} />}
      extraScreens={
        <>
          <Tabs.Screen name="vault" />
          <Tabs.Screen name="audit" />
          <Tabs.Screen name="buy" options={{ tabBarButton: () => null, headerShown: false }} />
          <Tabs.Screen name="skip" options={{ tabBarButton: () => null, headerShown: false }} />
        </>
      }
    />
  );
}
