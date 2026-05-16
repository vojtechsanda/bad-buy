import { BottomSheet, Button, ButtonText } from '@shared/components';
import { Switch } from '@shared/components/ui/switch';
import { Account } from '@shared/types';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { SettingsRow } from './SettingsRow';
import { DeleteAccountSheet } from './sheets/DeleteAccountSheet';
import { LogoutSheet } from './sheets/LogoutSheet';

type ProfileSettingsProps = {
  account: Account;
};

export function ProfileSettings({ account }: ProfileSettingsProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(account.notifications_enabled);

  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [, setPromoOpen] = useState(false);
  // const [upsellOpen, setUpsellOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <View className="divide-y divide-outline-200 rounded-md bg-background-0 shadow shadow-black/10">
        <SettingsRow label="Personal info" onPress={() => setPersonalInfoOpen(true)} />
        <SettingsRow label="Hobbies" onPress={() => {}} />
        <SettingsRow label="Redeem code" onPress={() => setPromoOpen(true)} />
        <SettingsRow
          label="Notifications"
          onPress={() => setNotificationsEnabled((v) => !v)}
          trailing={
            <Switch
              size="md"
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          }
        />
        <SettingsRow label="Log out" onPress={() => setLogoutOpen(true)} />
        <SettingsRow label="Delete account" danger onPress={() => setDeleteOpen(true)} isLastRow />
      </View>

      <BottomSheet isOpen={personalInfoOpen} onClose={() => setPersonalInfoOpen(false)}>
        <Text className="font-nunito-bold text-heading text-typography-900">Personal info</Text>
        <Text className="mt-2 font-nunito text-body text-typography-600">
          Personal info edit sheet — coming soon.
        </Text>
        <View className="mt-6">
          <Button
            variant="outline"
            action="primary"
            size="md"
            onPress={() => setPersonalInfoOpen(false)}
          >
            <ButtonText>Close</ButtonText>
          </Button>
        </View>
      </BottomSheet>

      <LogoutSheet isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
      <DeleteAccountSheet isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </>
  );
}
