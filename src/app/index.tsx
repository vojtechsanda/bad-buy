import { Redirect } from 'expo-router';

const isLogged = false;

export default function Index() {
  return <Redirect href={isLogged ? '/(app)/home' : '/(auth)/landing'} />;
}
