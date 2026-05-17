import { Text } from 'react-native';

type ErrorMessageProps = {
  message: string | null;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (message === null) return null;

  return <Text className="mb-3 font-nunito text-body-sm text-error-700">{message}</Text>;
}
