import { TotalSavedCard } from '@features/account/components';
import { mockAccount, mockAccountHistory } from '@features/account/store';
import {
  LevelProgressBar,
  PremiumInfoView,
  ProfileIdentityView,
  ProfileReferral,
  ProfileSettings,
} from '@features/profile/components';
import { ScreenContainer } from '@shared/components';
import { View } from 'react-native';

export default function Profile() {
  const account = mockAccount;
  const accountHistory = mockAccountHistory;

  return (
    <ScreenContainer>
      <View className="gap-6">
        <ProfileIdentityView account={account} />

        <LevelProgressBar account={account} />

        <TotalSavedCard
          history={accountHistory}
          currency={account.display_currency}
          label="Total saved"
        />

        <PremiumInfoView account={account} />

        <ProfileReferral account={account} />

        <ProfileSettings account={account} />
      </View>
    </ScreenContainer>
  );
}
