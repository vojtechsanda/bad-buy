import { PremiumUpsellSheet, PromoRedemptionSheet } from '@shared/components';
import { Switch } from '@shared/components/ui';
import { useHobbiesSWR } from '@shared/modules/hobby';
import { Account } from '@shared/types';
import { useState } from 'react';
import { View } from 'react-native';

import { SettingsRow } from './SettingsRow';
import { DeleteAccountSheet, HobbiesSheet, LogoutSheet, PersonalInfoEditSheet } from './sheets';

type ProfileSettingsProps = {
  account: Account;
};

export function ProfileSettings({ account }: ProfileSettingsProps) {
  const { hobbies, invalidateHobbies } = useHobbiesSWR();

  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isHobbiesOpen, setIsHobbiesOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);

  return (
    <View className="divide-y divide-outline-200 rounded-md bg-background-0 shadow shadow-black/10">
      <SettingsRow label="Personal info" onPress={() => setIsPersonalInfoOpen(true)} />
      <SettingsRow label="Hobbies" onPress={() => setIsHobbiesOpen(true)} />
      <SettingsRow label="Redeem code" onPress={() => setIsPromoOpen(true)} />
      <SettingsRow
        label="Notifications"
        onPress={() => setNotificationsEnabled((previous) => !previous)}
        trailing={
          <Switch size="md" value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
        }
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
        initialHobbies={hobbies}
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
