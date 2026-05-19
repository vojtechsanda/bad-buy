import { AuthProvider } from '@features/auth';
import { GluestackUIProvider } from '@providers/gluestack-ui-provider';
import React, { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <GluestackUIProvider mode="light">
      <SafeAreaProvider>
        <AuthProvider>{children}</AuthProvider>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
