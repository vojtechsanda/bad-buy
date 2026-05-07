import { Button, ButtonText } from '@shared/components/ui/button';
import { Image } from '@shared/components/ui/image';
import { StyleSheet, View } from 'react-native';

export default function Index() {
  return (
    <View className="bg-red-950" style={styles.container}>
      <Image
        size="2xl"
        source={{
          uri: 'https://fs.artdevivre.com/storage/articles/events-article/a-monet/fd4a2b62395c7281b28501fdc14421d6.jpg',
        }}
        alt="image"
      />
      <Button
        className="bg-blue-500 "
        variant="solid"
        size="md"
        action="primary"
        onPress={() =>
          alert(
            'Monet was a French painter, a founder of Impressionism, and is best known for his landscape paintings. The Stroll is one of his famous works, depicting a woman with a parasol walking in a field of flowers.',
          )
        }>
        <ButtonText>{'Find out more'}</ButtonText>
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
