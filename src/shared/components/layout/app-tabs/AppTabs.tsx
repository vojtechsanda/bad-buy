import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { ReactNode } from 'react';

import { AppTabBar } from './AppTabBar';
import { appTabsList } from './constants';

type AppTabsProps = {
  header: (props: BottomTabHeaderProps) => ReactNode;
};

export function AppTabs({ header }: AppTabsProps) {
  return (
    <Tabs
      initialRouteName="home"
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        header,
      }}>
      {appTabsList.map(({ name, options }) => (
        <Tabs.Screen key={name} name={name} options={options} />
      ))}
    </Tabs>
  );
}
