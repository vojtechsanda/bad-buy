import { getCurrentLevelInfo } from '@shared/modules/gamification';
import { Account } from '@shared/types';
import { Text, View } from 'react-native';

type LevelProgressBarProps = {
  account: Account;
};

export function LevelProgressBar({ account }: LevelProgressBarProps) {
  const currentLevelInfo = getCurrentLevelInfo(account.decision_count);

  return (
    <View className="gap-2">
      <View className="h-1.5 rounded-full bg-outline-200">
        <View
          className="h-1.5 rounded-full bg-primary-500"
          style={{ width: `${currentLevelInfo.progressInLevel * 100}%` }}
        />
      </View>

      <View className="flex-row justify-between">
        {currentLevelInfo.decisionsToNext !== null ? (
          <>
            <Text className="font-nunito-semibold text-body-sm text-typography-600">
              {currentLevelInfo.decisionsToNext} more to L{currentLevelInfo.nextLevel}
            </Text>
            <Text className="font-nunito-semibold text-body-sm text-primary-500">
              L{currentLevelInfo.nextLevel}: {currentLevelInfo.nextTier}
            </Text>
          </>
        ) : (
          <Text className="flex-1 text-center font-nunito-semibold text-body-sm text-typography-600">
            Max level reached
          </Text>
        )}
      </View>
    </View>
  );
}
