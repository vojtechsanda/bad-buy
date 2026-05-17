import { FC } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { SvgProps } from 'react-native-svg';

type IllustrationSvgFrameProps = {
  Svg: FC<SvgProps>;
};

export function IllustrationSvgFrame({ Svg }: IllustrationSvgFrameProps) {
  const { height } = useWindowDimensions();
  const size = height * 0.35;

  return (
    <View className="items-center">
      <Svg width={size} height={size} />
    </View>
  );
}
