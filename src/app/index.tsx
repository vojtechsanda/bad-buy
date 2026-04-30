import { Button, ButtonText } from '@shared/components/ui/button';
import { StyleSheet, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Button
        className="bg-blue-500"
        variant="solid"
        size="md"
        action="primary"
        onPress={() => alert('Why did you click me?')}>
        <ButtonText>{"Hello! Don't Click me Please!"}</ButtonText>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
