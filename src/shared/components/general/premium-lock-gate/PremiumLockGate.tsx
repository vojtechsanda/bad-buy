import { PremiumUpsellSheet, PromoRedemptionSheet } from '@shared/components/sheets';
import { mockAccount } from '@shared/modules/account';
import { ReactNode, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type PremiumLockGateProps = {
  children: ReactNode;
};

export function PremiumLockGate({ children }: PremiumLockGateProps) {
  const account = mockAccount;

  const [upsellOpen, setUpsellOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);

  const hasActivePremium =
    account.premium_expires_at && new Date(account.premium_expires_at) > new Date();

  if (hasActivePremium) {
    return <>{children}</>;
  }

  return (
    <View className="relative">
      <Pressable className="inset-0" onPress={() => setUpsellOpen(true)}>
        <View pointerEvents="none" style={{ opacity: 0.6 }}>
          {children}
        </View>
        <View className="absolute -right-1 -top-1 rounded-full bg-accent-500 px-1.5 py-px">
          <Text className="whitespace-nowrap font-nunito-extrabold text-[8px] uppercase tracking-wider text-typography-0">
            PRO
          </Text>
        </View>
      </Pressable>

      <PremiumUpsellSheet
        isOpen={upsellOpen}
        onClose={() => setUpsellOpen(false)}
        onRedeemPress={() => setPromoOpen(true)}
      />
      <PromoRedemptionSheet isOpen={promoOpen} onClose={() => setPromoOpen(false)} />
    </View>
  );
}
