import { isLogged } from '@features/auth/store';
import { Redirect, Stack } from 'expo-router';

export default function AppLayout() {
  if (!isLogged) {
    return <Redirect href="/(auth)/landing" />;
  }
  return <Stack />;
}
