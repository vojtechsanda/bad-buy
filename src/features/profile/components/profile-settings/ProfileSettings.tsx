import { PremiumUpsellSheet, PromoRedemptionSheet } from '@shared/components';
import { Switch } from '@shared/components/ui';
import { accountService, useAccountSWR } from '@shared/modules/account';
import { useHobbiesSWR } from '@shared/modules/hobby';
import { pushNotificationService } from '@shared/services';
import { Account, AccountHobby } from '@shared/types';
import { useEffect, useState } from 'react';
import { Alert, Linking, View } from 'react-native';

import { SettingsRow } from './SettingsRow';
import { DeleteAccountSheet, HobbiesSheet, LogoutSheet, PersonalInfoEditSheet } from './sheets';

type ProfileSettingsProps = {
  account: Account;
  accountHobbies: AccountHobby[];
};

export function ProfileSettings({ account, accountHobbies }: ProfileSettingsProps) {
  const { invalidateHobbies } = useHobbiesSWR();
  const { invalidateAccount } = useAccountSWR();

  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isHobbiesOpen, setIsHobbiesOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [osGranted, setOsGranted] = useState(false);

  useEffect(() => {
    pushNotificationService.getPermissionStatus().then((status) => {
      setOsGranted(status === 'granted');
    });
  }, []);

  const notificationsEnabled = account.notifications_enabled && osGranted;

  async function handleNotificationsToggle(newValue: boolean) {
    if (newValue === notificationsEnabled) return;

    if (newValue) {
      const status = await pushNotificationService.getPermissionStatus();

      if (status === 'granted') {
        await accountService.update({ notifications_enabled: true });
        setOsGranted(true);
        await invalidateAccount();
      } else if (status === 'undetermined') {
        const result = await pushNotificationService.requestPermission();
        if (result === 'granted') {
          setOsGranted(true);
          await accountService.update({ notifications_enabled: true });
          await invalidateAccount();
        } else {
          Alert.alert(
            'Notifications off',
            'You declined the notification permission. You can enable it anytime from here.',
          );
        }
      } else {
        Alert.alert(
          'Notifications off',
          'Enable notifications in your device settings to get reminded when a frozen decision is ready.',
          [
            { text: 'Not now', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
        );
      }
    } else {
      await accountService.update({ notifications_enabled: false });
      await invalidateAccount();
    }
  }

  return (
    <View className="divide-y divide-outline-200 rounded-md bg-background-0 shadow shadow-black/10">
      <SettingsRow label="Personal info" onPress={() => setIsPersonalInfoOpen(true)} />
      <SettingsRow label="Hobbies" onPress={() => setIsHobbiesOpen(true)} />
      <SettingsRow label="Redeem code" onPress={() => setIsPromoOpen(true)} />
      <SettingsRow
        label="Notifications"
        onPress={() => handleNotificationsToggle(!notificationsEnabled)}
        trailing={
          <Switch
            size="md"
            value={notificationsEnabled}
            onValueChange={handleNotificationsToggle}
          />
        }
      />
      {/* TODO: remove before shipping */}
      <SettingsRow
        label="[DEV] Test notification (10s)"
        onPress={async () => {
          const fakeId = 'dev-test-' + Date.now();
          const freezeUntil = new Date(Date.now() + 10_000).toISOString();
          await pushNotificationService.scheduleFreezeNotification(fakeId, freezeUntil);
          Alert.alert('Scheduled', 'A test notification will fire in 10 seconds.');
        }}
      />
      <SettingsRow label="Log out" onPress={() => setIsLogoutOpen(true)} />
      <SettingsRow
        label="Delete account"
        danger
        onPress={() => setIsDeleteAccountOpen(true)}
        isLastRow
      />

      <PersonalInfoEditSheet
        isOpen={isPersonalInfoOpen}
        onClose={() => setIsPersonalInfoOpen(false)}
        account={account}
      />
      <HobbiesSheet
        isOpen={isHobbiesOpen}
        onClose={() => setIsHobbiesOpen(false)}
        onSaved={invalidateHobbies}
        initialHobbies={accountHobbies}
      />
      <LogoutSheet isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
      <DeleteAccountSheet
        isOpen={isDeleteAccountOpen}
        onClose={() => setIsDeleteAccountOpen(false)}
      />
      <PromoRedemptionSheet isOpen={isPromoOpen} onClose={() => setIsPromoOpen(false)} />
      <PremiumUpsellSheet
        isOpen={isUpsellOpen}
        onClose={() => setIsUpsellOpen(false)}
        onRedeemPress={() => setIsPromoOpen(true)}
      />
    </View>
  );
}
