import { ScreenContainer } from '@shared/components';
import { Text } from 'react-native';

export default function Audit() {
  return (
    <ScreenContainer withSafeAreaTop={false}>
      <Text className="font-nunito-bold text-heading text-typography-900">
        Content of Audit page
      </Text>
    </ScreenContainer>
  );
}
