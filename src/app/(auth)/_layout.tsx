import { isLogged } from '@features/auth/store';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  if (isLogged) return <Redirect href="/(app)/home" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
