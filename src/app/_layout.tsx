import '../../global.css';

import { AppProviders } from '@providers/AppProviders';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack />
    </AppProviders>
  );
}
