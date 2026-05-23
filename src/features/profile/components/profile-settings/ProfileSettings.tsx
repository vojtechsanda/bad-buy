import { PremiumUpsellSheet, PromoRedemptionSheet } from '@shared/components';
import { Switch } from '@shared/components/ui/switch';
import { Account } from '@shared/types';
import { useState } from 'react';
import { View } from 'react-native';

import { SettingsRow } from './SettingsRow';
import { DeleteAccountSheet, LogoutSheet, PersonalInfoEditSheet } from './sheets';

type ProfileSettingsProps = {
  account: Account;
};

export function ProfileSettings({ account }: ProfileSettingsProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(account.notifications_enabled);

  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [upsellOpen, setUpsellOpen] = useState(false);
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

      <PersonalInfoEditSheet
        isOpen={personalInfoOpen}
        onClose={() => setPersonalInfoOpen(false)}
        account={account}
      />

      <PremiumUpsellSheet
        isOpen={upsellOpen}
        onClose={() => setUpsellOpen(false)}
        onRedeemPress={() => setPromoOpen(true)}
      />
      <PromoRedemptionSheet isOpen={promoOpen} onClose={() => setPromoOpen(false)} />

      <LogoutSheet isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
      <DeleteAccountSheet isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </>
  );
}
