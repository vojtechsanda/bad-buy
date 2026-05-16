import { CountdownPill, PremiumUpsellSheet, PromoRedemptionSheet } from '@shared/components';
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
  const [promoOpen, setPromoOpen] = useState(false);

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

      <PremiumUpsellSheet
        isOpen={upsellOpen}
        onClose={() => setUpsellOpen(false)}
        onRedeemPress={() => setPromoOpen(true)}
      />

      <PromoRedemptionSheet isOpen={promoOpen} onClose={() => setPromoOpen(false)} />
    </>
  );
}
