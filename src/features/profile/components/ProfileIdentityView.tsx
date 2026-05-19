import { getAccountPictureUrl } from '@shared/modules/account';
import { getCurrentLevelInfo } from '@shared/modules/gamification';
import { Account } from '@shared/types';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

type ProfileIdentityViewProps = {
  account: Account;
};

export function ProfileIdentityView({ account }: ProfileIdentityViewProps) {
  const currentLevelInfo = getCurrentLevelInfo(account.decision_count);

  return (
    <View className="items-center gap-2">
      <Image
        source={{ uri: getAccountPictureUrl(account) }}
        style={{ width: 112, height: 112, borderRadius: 48 }}
        contentFit="cover"
      />

      <Text className="font-nunito-bold text-display-md text-typography-900">{account.name}</Text>

      <View className="flex-row items-center gap-2">
        <View
          style={{ width: 24, height: 24, borderRadius: 14 }}
          className="items-center justify-center bg-primary-500"
        >
          <Text className="font-nunito-extrabold text-body-sm text-typography-0">
            {currentLevelInfo.level}
          </Text>
        </View>
        <Text className="font-nunito text-body text-typography-600">
          L{currentLevelInfo.level} · {currentLevelInfo.tier}
        </Text>
      </View>
    </View>
  );
}
