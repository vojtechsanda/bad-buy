import { useAuth } from '@features/auth/hooks';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { isLogged, isLoading } = useAuth();

  if (isLoading) return null;

  if (isLogged) return <Redirect href="/(app)/home" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
