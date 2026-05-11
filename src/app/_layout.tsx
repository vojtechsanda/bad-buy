import '../../global.css';

import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/nunito';
import { AppProviders } from '@providers/AppProviders';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  const isReady = fontsLoaded || !!fontError;

  useEffect(() => {
    if (fontError) {
      console.error('Font loading error:', fontError);
    }
    if (isReady) SplashScreen.hideAsync();
  }, [isReady, fontError]);

  if (!isReady) return null;

  return (
    <AppProviders>
      <Stack />
    </AppProviders>
  );
}
