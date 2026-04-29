import { StyleSheet, View } from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';

export default function Index() {
  return (
    <View style={styles.container}>
      <Button
        className="bg-blue-500"
        variant="solid"
        size="md"
        action="primary"
        onPress={() => alert('Why did you click me?')}>
        <ButtonText>{"Hey! Don't Click me Please!"}</ButtonText>
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
