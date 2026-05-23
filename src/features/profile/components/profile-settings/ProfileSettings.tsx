import { Account } from '@shared/types';
import { useState } from 'react';
import { View } from 'react-native';

import { SettingsRow } from './SettingsRow';
import { DeleteAccountSheet, HobbiesSheet, LogoutSheet, PersonalInfoEditSheet } from './sheets';

type ProfileSettingsProps = {
  account: Account;
};

export function ProfileSettings({ account }: ProfileSettingsProps) {
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [hobbiesOpen, setHobbiesOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  return (
    <View className="overflow-hidden rounded-2xl border border-outline-100">
      <SettingsRow label="Personal info" onPress={() => setPersonalInfoOpen(true)} />
      <SettingsRow label="Hobbies" onPress={() => setHobbiesOpen(true)} />
      <SettingsRow label="Log out" onPress={() => setLogoutOpen(true)} />
      <SettingsRow
        label="Delete account"
        danger
        onPress={() => setDeleteAccountOpen(true)}
        isLastRow
      />

      <PersonalInfoEditSheet
        isOpen={personalInfoOpen}
        onClose={() => setPersonalInfoOpen(false)}
        account={account}
      />
      <HobbiesSheet isOpen={hobbiesOpen} onClose={() => setHobbiesOpen(false)} />
      <LogoutSheet isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
      <DeleteAccountSheet isOpen={deleteAccountOpen} onClose={() => setDeleteAccountOpen(false)} />
    </View>
  );
}
