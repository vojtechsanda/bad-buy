import { BottomSheet, BottomSheetProps } from '@shared/components/layout/bottom-sheet';
import { themeColor } from '@shared/constants';
import { Text, View } from 'react-native';

import { SheetActions } from '../sheet-actions';
import { SheetHeader } from '../sheet-header';
import { premiumFeatures } from './constants';

type PremiumUpsellSheetProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'> & {
  onRedeemPress: () => void;
};

export function PremiumUpsellSheet({ isOpen, onClose, onRedeemPress }: PremiumUpsellSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <SheetHeader
        title="Unlock Premium"
        subtitle="Enter a referral or promo code to get 3 months free."
      />

      <View className="mt-6 gap-4">
        {premiumFeatures.map(({ Icon, title, description }) => (
          <View key={title} className="flex-row items-start gap-3">
            <Icon size={24} strokeWidth={1.75} color={themeColor.primary500} />
            <View className="flex-1" style={{ minWidth: 0 }}>
              <Text className="font-nunito-semibold text-body text-typography-900">{title}</Text>
              <Text className="font-nunito text-body-sm text-typography-600">{description}</Text>
            </View>
          </View>
        ))}
      </View>

      <SheetActions
        confirmLabel="I have a code"
        onConfirm={() => {
          onClose();
          onRedeemPress();
        }}
      />
    </BottomSheet>
  );
}
