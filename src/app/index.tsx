import { isLogged } from '@features/auth/store';
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href={isLogged ? '/(app)/home' : '/(auth)/landing'} />;
}
