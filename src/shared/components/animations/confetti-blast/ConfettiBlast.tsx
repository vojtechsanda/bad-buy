import { useFocusEffect } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useCallback, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

type ConfettiBlastProps = {
  onComplete?: () => void;
};

export function ConfettiBlast({ onComplete }: ConfettiBlastProps) {
  const [key, setKey] = useState(0);
  const { width, height } = useWindowDimensions();

  useFocusEffect(
    useCallback(() => {
      setKey((prev) => prev + 1);
    }, []),
  );

  if (key === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LottieView
        key={key}
        source={require('@assets/animations/confetti.json')}
        autoPlay
        loop={false}
        onAnimationFinish={onComplete}
        style={{ width, height }}
      />
    </View>
  );
}
