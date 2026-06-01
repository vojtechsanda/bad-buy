import { useAuth } from '@features/auth';
import { AppTabs, AppTopBar, FullSizeSpinner } from '@shared/components';
import { useAccountSWR } from '@shared/modules/account';
import { useExchangeRates } from '@shared/modules/currency';
import { Redirect, Tabs } from 'expo-router';

export default function AppLayout() {
  const { isLogged, isLoading: isAuthLoading } = useAuth();
  const { isLoading: isAccountLoading, account } = useAccountSWR();
  const { isLoading: isExchangeRatesLoading } = useExchangeRates();

  if (isAuthLoading || isAccountLoading || isExchangeRatesLoading) return <FullSizeSpinner />;

  if (!isLogged) {
    return <Redirect href="/(auth)/landing" />;
  }

  if (!account) {
    return <Redirect href="/(onboarding)/onboarding" />;
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
