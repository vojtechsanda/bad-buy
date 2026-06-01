'use client';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const skeletonStyle = tva({
  base: 'bg-background-200 overflow-hidden',
  variants: {
    variant: {
      sharp: 'rounded-none',
      rounded: 'rounded-md',
      circular: 'rounded-full',
    },
  },
  defaultVariants: {
    variant: 'rounded',
  },
});

const skeletonTextLineStyle = tva({
  base: 'bg-background-200 rounded-sm w-full',
});

type SkeletonProps = React.ComponentPropsWithoutRef<typeof View> & {
  variant?: 'sharp' | 'rounded' | 'circular';
  startColor?: string;
  isLoaded?: boolean;
  speed?: number;
  children?: React.ReactNode;
  className?: string;
};

type SkeletonTextProps = React.ComponentPropsWithoutRef<typeof View> & {
  _lines?: number;
  startColor?: string;
  isLoaded?: boolean;
  speed?: number;
  gap?: number;
  children?: React.ReactNode;
  className?: string;
};

function usePulse(speed: number) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: (1 / speed) * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: (1 / speed) * 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();

    return () => animation.stop();
  }, [opacity, speed]);

  return opacity;
}

const Skeleton = React.forwardRef<React.ElementRef<typeof View>, SkeletonProps>(function Skeleton(
  { variant = 'rounded', isLoaded = false, speed = 2, children, className, style, ...props },
  ref,
) {
  const opacity = usePulse(speed);

  if (isLoaded) {
    return (
      <View ref={ref} {...props} style={style}>
        {children}
      </View>
    );
  }

  return (
    <Animated.View
      {...props}
      style={[style, { opacity }]}
      className={skeletonStyle({ variant, class: className })}
    />
  );
});

const SkeletonText = React.forwardRef<React.ElementRef<typeof View>, SkeletonTextProps>(
  function SkeletonText(
    { _lines = 3, isLoaded = false, speed = 2, gap = 2, children, className, style, ...props },
    ref,
  ) {
    const opacity = usePulse(speed);

    if (isLoaded) {
      return (
        <View ref={ref} {...props} style={style}>
          {children}
        </View>
      );
    }

    return (
      <View ref={ref} {...props} style={[style, { gap: gap * 4 }]}>
        {Array.from({ length: _lines }, (_, i) => (
          <Animated.View
            key={i}
            style={{ opacity, width: i === _lines - 1 && _lines > 1 ? '80%' : '100%' }}
            className={skeletonTextLineStyle({ class: i === 0 ? className : undefined })}
          />
        ))}
      </View>
    );
  },
);

Skeleton.displayName = 'Skeleton';
SkeletonText.displayName = 'SkeletonText';

export { Skeleton, SkeletonText };
