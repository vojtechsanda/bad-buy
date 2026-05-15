import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { activeColorMap, appTabsList } from './constants';

type AppTabBarProps = BottomTabBarProps;

export function AppTabBar({ state, descriptors, navigation }: AppTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-t border-outline-200 bg-background-0 pt-2"
      style={{ paddingBottom: insets.bottom }}>
      <View className="h-14 flex-row">
        {state.routes.map((route, index) => {
          const appTab = appTabsList.find((option) => option.name === route.name);
          if (!appTab) return null;

          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const color = isFocused ? activeColorMap.active : activeColorMap.inactive;
          const Icon = appTab.icon;
          const label = String(options.tabBarLabel ?? options.title ?? route.name);

          return (
            <Pressable
              key={route.key}
              onPress={() => {
                if (!isFocused) {
                  navigation.navigate(route.name, route.params);
                }
              }}
              className="flex-1 items-center justify-center gap-1">
              {Icon && (
                <Icon
                  size={22}
                  strokeWidth={1.75}
                  color={color}
                  fill={isFocused ? color : 'none'}
                />
              )}
              <Text className="font-nunito-semibold text-xs" style={{ color }}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
