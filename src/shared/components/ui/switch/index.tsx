import { themeColor } from '@shared/constants';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable } from 'react-native';

const THUMB_SIZE = 20;
const TRACK_WIDTH = 44;
const TRACK_HEIGHT = 26;
const THUMB_PADDING = 3;
const THUMB_ON_LEFT = TRACK_WIDTH - THUMB_SIZE - THUMB_PADDING;

const OFF_COLOR = 'rgb(210, 205, 198)';

const SIZE_SCALE: Record<'sm' | 'md' | 'lg', number> = { sm: 0.75, md: 1, lg: 1.25 };

type SwitchProps = {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const Switch = function Switch({
  value = false,
  onValueChange,
  disabled = false,
  size = 'md',
}: SwitchProps) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 200,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const thumbLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_PADDING, THUMB_ON_LEFT],
  });
  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [OFF_COLOR, themeColor.primary500],
  });

  return (
    <Pressable
      onPress={() => !disabled && onValueChange?.(!value)}
      disabled={disabled}
      style={{ opacity: disabled ? 0.4 : 1, transform: [{ scale: SIZE_SCALE[size] }] }}
    >
      <Animated.View
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: 9999,
          backgroundColor,
          flexShrink: 0,
        }}
      >
        <Animated.View
          style={{
            position: 'absolute',
            top: THUMB_PADDING,
            left: thumbLeft,
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: 9999,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 3,
            elevation: 2,
          }}
        />
      </Animated.View>
    </Pressable>
  );
};

Switch.displayName = 'Switch';
export { Switch };
