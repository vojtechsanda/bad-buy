import { themeColor } from '@shared/constants';
import { Home, Snowflake, User } from 'lucide-react-native';

import { AppTabsItem } from './types';

export const appTabsList: AppTabsItem[] = [
  {
    name: 'vault',
    icon: Snowflake,
    options: {
      title: 'Vault',
    },
  },
  {
    name: 'home',
    icon: Home,
    options: {
      title: '',
      tabBarLabel: 'Home',
    },
  },
  {
    name: 'profile',
    icon: User,
    options: {
      title: 'Profile',
    },
  },
];

export const activeColorMap = {
  active: themeColor.primary500,
  inactive: themeColor.typography400,
} as const;
