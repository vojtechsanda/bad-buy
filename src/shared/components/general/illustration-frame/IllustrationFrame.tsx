import { Image } from '@shared/components/ui/image';
import { ImageSourcePropType, StyleProp, View, ViewStyle } from 'react-native';

type IllustrationFrameProps = {
  source: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
};

export function IllustrationFrame({ source, style }: IllustrationFrameProps) {
  return (
    <View style={style} className="w-full overflow-hidden rounded-2xl">
      <Image
        source={source}
        size="none"
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
        alt=""
      />
    </View>
  );
}
