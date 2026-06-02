import {
  LevelProgressBar,
  PremiumInfoView,
  ProfileIdentityView,
  ProfileReferral,
  ProfileSettings,
} from '@features/profile';
import { FullSizeError, FullSizeSpinner, ScreenContainer } from '@shared/components';
import { TotalSavedCard, useAccountSWR } from '@shared/modules/account';
import { useHobbiesSWR } from '@shared/modules/hobby/hooks/useHobbiesSWR';
import { useTrackedItemsSWR } from '@shared/swr';
import { View } from 'react-native';

export default function Profile() {
  const { account, isLoading } = useAccountSWR();
  const { trackedItems, isLoading: isTrackedItemsLoading } = useTrackedItemsSWR();
  const { hobbies, isLoading: isHobbiesLoading } = useHobbiesSWR();

  if (isLoading || isTrackedItemsLoading || isHobbiesLoading) return <FullSizeSpinner />;
  if (!account) return <FullSizeError message="Unable to load account, please try again later" />;
  if (!hobbies) return <FullSizeError message="Unable to load hobbies, please try again later" />;
  if (!trackedItems) {
    return <FullSizeError message="Unable to load history, please try again later" />;
  }

  return (
    <ScreenContainer>
      <View className="gap-6">
        <ProfileIdentityView account={account} />

        <LevelProgressBar account={account} />

        <TotalSavedCard
          history={trackedItems}
          currency={account.display_currency}
          label="Total saved"
        />

        <PremiumInfoView account={account} />

        <ProfileReferral account={account} />

        <ProfileSettings account={account} accountHobbies={hobbies} />
      </View>
    </ScreenContainer>
  );
}
