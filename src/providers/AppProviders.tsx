import { GluestackUIProvider } from '@providers/gluestack-ui-provider';
import React from 'react';

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <GluestackUIProvider mode="light">{children}</GluestackUIProvider>;
}
