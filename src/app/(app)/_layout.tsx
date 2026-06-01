import { useAuth } from '@features/auth';
import { AppTabs, AppTopBar, FullSizeSpinner } from '@shared/components';
import { useAccountSWR } from '@shared/modules/account';
import { useExchangeRates } from '@shared/modules/currency';
import { COLD_START_NOTIFICATION_MAX_AGE_S } from '@shared/services';
import * as Notifications from 'expo-notifications';
import { Redirect, Tabs, router } from 'expo-router';
import { useEffect, useRef } from 'react';

export default function AppLayout() {
  const { isLogged, isLoading: isAuthLoading } = useAuth();
  const { isLoading: isAccountLoading, account } = useAccountSWR();
  const { isLoading: isExchangeRatesLoading } = useExchangeRates();
  const hasHandledColdStart = useRef(false);

  useEffect(() => {
    if (!isLogged || !account || hasHandledColdStart.current) return;
    hasHandledColdStart.current = true;

    const response = Notifications.getLastNotificationResponse();
    if (!response) return;
    const tappedAt = response.notification.date;
    const isRecent = Date.now() / 1000 - tappedAt < COLD_START_NOTIFICATION_MAX_AGE_S;
    if (!isRecent) return;
    const vaultId = response.notification.request.content.data?.vaultId as string | undefined;
    if (vaultId) router.push({ pathname: '/(app)/vault/[id]', params: { id: vaultId } });
  }, [isLogged, account]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const vaultId = response.notification.request.content.data?.vaultId as string | undefined;
      if (vaultId) router.push({ pathname: '/(app)/vault/[id]', params: { id: vaultId } });
    });

    return () => subscription.remove();
  }, []);

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
