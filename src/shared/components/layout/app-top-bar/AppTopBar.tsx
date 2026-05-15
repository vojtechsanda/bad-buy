import { themeColor } from '@shared/constants';
import { Bell } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AppTopBarProps = {
  title?: string;
  showBadge?: boolean;
};

export function AppTopBar({ title, showBadge = false }: AppTopBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center justify-between bg-background-50 px-5 pb-3"
      style={{ paddingTop: insets.top + 12 }}>
      <Text className="font-nunito-bold text-heading text-typography-900">{title}</Text>
      <View>
        <Bell size={22} strokeWidth={1.75} color={themeColor.typography900} />
        {showBadge && (
          <View className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent-500" />
        )}
      </View>
    </View>
  );
}
