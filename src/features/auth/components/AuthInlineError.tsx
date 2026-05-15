import { Text } from 'react-native';

type AuthInlineErrorProps = {
  message: string | null;
};

export function AuthInlineError({ message }: AuthInlineErrorProps) {
  if (message === null) return null;

  return <Text className="mb-3 font-nunito text-body-sm text-error-700">{message}</Text>;
}
