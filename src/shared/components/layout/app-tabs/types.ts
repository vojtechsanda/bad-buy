import { Tabs } from 'expo-router';
import { LucideProps } from 'lucide-react-native';
import { ComponentType } from 'react';

type TabsScreenOptions = Parameters<typeof Tabs.Screen>[0]['options'];

export type AppTabsItem = {
  name: string;
  icon: ComponentType<LucideProps>;
  options: TabsScreenOptions;
};
