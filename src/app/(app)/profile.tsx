import {
  LevelProgressBar,
  PremiumInfoView,
  ProfileIdentityView,
  ProfileReferral,
  ProfileSettings,
} from '@features/profile';
import { ScreenContainer, StreamLoader } from '@shared/components';
import { TotalSavedCard, mockAccount, mockAccountHistory } from '@shared/modules/account';
import type { Account, Stream } from '@shared/types';
import { View } from 'react-native';

export default function Profile() {
  const stream: Stream<Account> = (onData) => {
    onData(mockAccount);

    return () => {};
  };

  return (
    <StreamLoader stream={stream}>
      {(account) => (
        <ScreenContainer>
          <View className="gap-6">
            <ProfileIdentityView account={account} />

            <LevelProgressBar account={account} />

            <TotalSavedCard
              history={mockAccountHistory}
              currency={account.display_currency}
              label="Total saved"
            />

            <PremiumInfoView account={account} />

            <ProfileReferral account={account} />

            <ProfileSettings account={account} />
          </View>
        </ScreenContainer>
      )}
    </StreamLoader>
  );
}
