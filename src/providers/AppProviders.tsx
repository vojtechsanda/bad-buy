import { AuthProvider } from '@features/auth';
import { GluestackUIProvider } from '@providers/gluestack-ui-provider';
import { ExchangeRatesProvider } from '@shared/modules/currency';
import React, { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider mode="light">
        <SafeAreaProvider>
          <AuthProvider>
            <ExchangeRatesProvider>{children}</ExchangeRatesProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
