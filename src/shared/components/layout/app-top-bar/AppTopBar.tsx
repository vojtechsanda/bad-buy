import { themeColor } from '@shared/constants';
import { useRouter } from 'expo-router';
import { Bell, ChevronLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AppTopBarProps = {
  title?: string;
};

export function AppTopBar({ title }: AppTopBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // TODO: Connect to notifications and show badge when there are unread notifications
  const showBadge = false;

  return (
    <View
      className="flex-row items-center justify-between bg-background-50 px-5 pb-3"
      style={{ paddingTop: insets.top + 12 }}
    >
      <View className="flex-row items-center gap-1">
        {router.canGoBack() && (
          <Pressable onPress={() => router.back()} className="-ml-2 rounded-full p-1.5">
            <ChevronLeft size={22} strokeWidth={1.75} color={themeColor.typography900} />
          </Pressable>
        )}
        <Text className="font-nunito-bold text-heading text-typography-900">{title}</Text>
      </View>

      <View>
        <Bell size={22} strokeWidth={1.75} color={themeColor.typography900} />
        {showBadge && (
          <View className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent-500" />
        )}
      </View>
    </View>
  );
}
