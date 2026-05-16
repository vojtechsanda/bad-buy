import { BottomSheet, Button, ButtonText, CountdownPill } from '@shared/components';
import { themeColor } from '@shared/constants';
import { Account } from '@shared/types';
import { ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { PremiumStatusBadge } from './PremiumStatusBadge';

type PremiumInfoViewProps = {
  account: Account;
};

export function PremiumInfoView({ account }: PremiumInfoViewProps) {
  const [upsellOpen, setUpsellOpen] = useState(false);

  const isPremium =
    account.premium_expires_at !== null && new Date(account.premium_expires_at) > new Date();

  return (
    <>
      <Pressable
        onPress={isPremium ? undefined : () => setUpsellOpen(true)}
        className="flex-row items-center justify-between rounded-md bg-background-0 p-5 shadow shadow-black/10"
      >
        <PremiumStatusBadge isPremium={isPremium} />

        <CountdownPill
          expiresAt={account.premium_expires_at!}
          expiredLabel={
            <View className="flex-row items-center gap-1">
              <Text className="font-nunito-semibold text-body text-primary-500">Get Premium</Text>
              <ChevronRight size={18} strokeWidth={2} color={themeColor.primary500} />
            </View>
          }
          formatExpireAtLabel={(label) => `expires ${label}`}
          className="font-nunito-semibold !text-body !text-primary-500"
        />
      </Pressable>

      <BottomSheet isOpen={upsellOpen} onClose={() => setUpsellOpen(false)}>
        <Text className="font-nunito-bold text-heading text-typography-900">Unlock Premium</Text>
        <Text className="mt-2 font-nunito text-body text-typography-600">
          Premium upsell sheet — coming soon.
        </Text>
        <View className="mt-6">
          <Button variant="outline" action="primary" size="md" onPress={() => setUpsellOpen(false)}>
            <ButtonText>Close</ButtonText>
          </Button>
        </View>
      </BottomSheet>
    </>
  );
}
