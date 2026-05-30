import { themeColor } from '@shared/constants';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { knobInset, knobSize, trackHeight } from './constants';
import { useSwipeGesture } from './hooks';

type SwipeToConfirmProps = {
  label: string;
  onConfirm: () => void;
};

export function SwipeToConfirm({ label, onConfirm }: SwipeToConfirmProps) {
  const [trackWidth, setTrackWidth] = useState(0);

  const { gesturePan, translation } = useSwipeGesture({ trackWidth, onConfirm });

  const knobAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translation }],
  }));

  return (
    <GestureDetector gesture={gesturePan}>
      <View
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        style={{ height: trackHeight }}
        className="w-full overflow-hidden rounded-lg bg-primary-100"
      >
        <View className="absolute inset-0 items-center justify-center">
          <Text className="font-nunito-semibold text-body-lg text-primary-700">{label}</Text>
        </View>

        <Animated.View
          style={[
            { width: knobSize, height: knobSize, left: knobInset, top: knobInset },
            knobAnimatedStyle,
          ]}
          className="absolute items-center justify-center rounded-full bg-primary-500 shadow-raised"
        >
          <Check size={24} strokeWidth={2} color={themeColor.secondary0} />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
