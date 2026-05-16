import { mockAccount } from '@features/account/store';
import { BottomSheet } from '@shared/components/layout';
import { Button, ButtonText } from '@shared/components/ui';
import { ReactNode, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type PremiumLockGateProps = {
  children: ReactNode;
};

export function PremiumLockGate({ children }: PremiumLockGateProps) {
  const account = mockAccount;

  const [premiumUpsellSheetOpen, setPremiumUpsellSheetOpen] = useState(false);

  const hasActivePremium =
    account.premium_expires_at && new Date(account.premium_expires_at) > new Date();

  if (hasActivePremium) {
    return <>{children}</>;
  }

  return (
    <View className="relative">
      <View pointerEvents="none" style={{ opacity: 0.6 }}>
        {children}
      </View>
      <View className="absolute -right-1 -top-1 rounded-full bg-accent-500 px-1.5 py-px">
        <Text className="whitespace-nowrap font-nunito-extrabold text-[8px] uppercase tracking-wider text-typography-0">
          PRO
        </Text>
      </View>
      <Pressable className="absolute inset-0" onPress={() => setPremiumUpsellSheetOpen(true)} />
      <BottomSheet isOpen={premiumUpsellSheetOpen} onClose={() => setPremiumUpsellSheetOpen(false)}>
        <Text className="font-nunito-bold text-heading text-typography-900">Premium Upsell</Text>
        <Text className="mt-2 font-nunito text-body text-typography-600">
          Upgrade to Premium for access to all features.
        </Text>
        <View className="mt-6">
          <Button
            variant="outline"
            action="primary"
            size="md"
            onPress={() => setPremiumUpsellSheetOpen(false)}
          >
            <ButtonText>Close</ButtonText>
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}
