import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getBackgroundClass } from './styles';

export type ScreenContainerProps = {
  children: ReactNode;
  stickyBottom?: ReactNode;
  scrollable?: boolean;
  withHorizontalPadding?: boolean;
  background?: 'bg' | 'surface' | 'transparent';
  withSafeAreaTop?: boolean;
  withSafeAreaBottom?: boolean;
};

export function ScreenContainer({
  children,
  stickyBottom,
  scrollable = true,
  withHorizontalPadding = true,
  background = 'bg',
  withSafeAreaTop = true,
  withSafeAreaBottom = true,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const hPadding = withHorizontalPadding ? 'px-5' : '';

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${getBackgroundClass(background)}`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ paddingTop: withSafeAreaTop ? insets.top : 0 }}>
      {scrollable ? (
        <ScrollView className={`flex-1 ${hPadding} py-2`} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View className={`flex-1 ${hPadding}`}>{children}</View>
      )}

      {stickyBottom ? (
        <View
          className="border-t border-outline-200 px-5 py-3"
          style={{ paddingBottom: (withSafeAreaBottom ? insets.bottom : 0) + 12 }}>
          {stickyBottom}
        </View>
      ) : (
        withSafeAreaBottom && <View style={{ height: insets.bottom }} />
      )}
    </KeyboardAvoidingView>
  );
}
