import { CountdownPill } from '@shared/components';
import { themeColor } from '@shared/constants';
import { convertAndFormatFromUsd } from '@shared/modules/currency';
import { TrackedItem } from '@shared/types';
import { useRouter } from 'expo-router';
import { ChevronRight, Clock, Snowflake } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

type VaultRowProps = {
  item: TrackedItem;
};

export function VaultRow({ item }: VaultRowProps) {
  const router = useRouter();
  const thawed = item.freeze_until !== null && new Date(item.freeze_until) <= new Date();

  return (
    <Pressable
      className="flex-row items-center gap-3 rounded-md border border-outline-100 bg-background-0 p-4 shadow-raised active:opacity-70"
      onPress={() =>
        router.push({
          pathname: '/(app)/vault/[id]',
          params: { id: item.id },
        })
      }
    >
      <View
        style={{ width: 44, height: 44, borderRadius: 22 }}
        className={`items-center justify-center ${thawed ? 'bg-accent-100' : 'bg-primary-100'}`}
      >
        {thawed ? (
          <Clock size={22} strokeWidth={1.75} color={themeColor.accent500} />
        ) : (
          <Snowflake size={22} strokeWidth={1.75} color={themeColor.primary500} />
        )}
      </View>

      <View className="flex-1 gap-0.5" style={{ minWidth: 0 }}>
        <Text className="font-nunito-semibold text-body-lg text-typography-900" numberOfLines={1}>
          {item.name}
        </Text>
        {item.freeze_until && (
          <CountdownPill expiresAt={item.freeze_until} expiredLabel="Needs a decision" />
        )}
      </View>

      <Text className="font-nunito text-body text-typography-600">
        {convertAndFormatFromUsd(item.price_usd, item.price_currency)}
      </Text>

      <ChevronRight size={20} strokeWidth={1.75} color={themeColor.typography400} />
    </Pressable>
  );
}
