import { GluestackUIProvider } from '@providers/gluestack-ui-provider';
import React, { ReactNode } from 'react';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <GluestackUIProvider mode="light">{children}</GluestackUIProvider>;
}
