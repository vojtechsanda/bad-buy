import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { BlurTargetView } from 'expo-blur';
import { ReactNode, useContext, useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BlurRefProvider } from './blurRefContext';
import { getBackgroundClass } from './styles';

export type ScreenContainerProps = {
  children: ReactNode;
  stickyBottom?: ReactNode;
  scrollable?: boolean;
  withHorizontalPadding?: boolean;
  background?: 'bg' | 'surface' | 'transparent';
  withSafeAreaTop?: boolean;
};

export function ScreenContainer({
  children,
  stickyBottom,
  scrollable = true,
  withHorizontalPadding = true,
  background = 'bg',
  withSafeAreaTop = false,
}: ScreenContainerProps) {
  const blurRef = useRef<View | null>(null);

  const insets = useSafeAreaInsets();
  const tabBarHeight = useContext(BottomTabBarHeightContext);

  const withSafeAreaBottom = tabBarHeight === 0 || tabBarHeight === undefined;

  const bottomSpacing = tabBarHeight || insets.bottom;
  const hPadding = withHorizontalPadding ? 'px-5' : '';

  return (
    <BlurRefProvider blurRef={blurRef}>
      <KeyboardAvoidingView
        className={`flex-1 ${getBackgroundClass(background)}`}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ paddingTop: withSafeAreaTop ? insets.top : 0 }}>
        {scrollable ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              withSafeAreaBottom
                ? { paddingVertical: 8, paddingBottom: bottomSpacing }
                : { paddingVertical: 8 }
            }>
            <BlurTargetView ref={blurRef}>
              <View className={`flex-1 ${hPadding} py-2`}>{children}</View>
            </BlurTargetView>
          </ScrollView>
        ) : (
          <BlurTargetView ref={blurRef}>
            <View className={`flex-1 ${hPadding} py-2`}>{children}</View>
          </BlurTargetView>
        )}

        {stickyBottom ? (
          <View
            className="border-t border-outline-200 px-5 py-3"
            style={{ paddingBottom: (withSafeAreaBottom ? bottomSpacing : 0) + 12 }}>
            {stickyBottom}
          </View>
        ) : (
          withSafeAreaBottom && <View style={{ height: bottomSpacing }} />
        )}
      </KeyboardAvoidingView>
    </BlurRefProvider>
  );
}
