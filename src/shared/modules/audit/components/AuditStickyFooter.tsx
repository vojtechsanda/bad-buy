import { BottomSheet, Button, ButtonText, SwipeToConfirm } from '@shared/components';
import { themeColor } from '@shared/constants';
import { ShoppingBag, Snowflake } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';

type AuditStickyFooterProps = {
  freezeLabel?: string;
  onSkip: () => void;
  onFreeze: () => void;
  onBuy: () => void;
};

export function AuditStickyFooter({
  onSkip,
  onBuy,
  freezeLabel = 'Freeze',
}: AuditStickyFooterProps) {
  const [freezeSheetOpen, setFreezeSheetOpen] = useState(false);

  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <Button
          variant="outline"
          action="primary"
          className="flex-1 bg-background-0"
          onPress={onBuy}
        >
          <ShoppingBag size={18} strokeWidth={1.75} color={themeColor.primary500} />
          <ButtonText>Buy</ButtonText>
        </Button>

        <Button
          variant="outline"
          action="primary"
          className="flex-1 bg-background-0"
          onPress={() => setFreezeSheetOpen(true)}
        >
          <Snowflake size={18} strokeWidth={1.75} color={themeColor.primary500} />
          <ButtonText>{freezeLabel}</ButtonText>
        </Button>
      </View>

      <SwipeToConfirm label="Swipe to skip" onConfirm={onSkip} />

      <BottomSheet isOpen={freezeSheetOpen} onClose={() => setFreezeSheetOpen(false)}>
        <Text className="font-nunito-bold text-heading text-typography-900">
          Freeze sheet — coming soon
        </Text>
        <Text className="mt-2 font-nunito text-body text-typography-600">
          Freeze functionality will be added in a later issue.
        </Text>
        <View className="mt-6">
          <Button
            variant="outline"
            action="primary"
            size="md"
            onPress={() => setFreezeSheetOpen(false)}
          >
            <ButtonText>Close</ButtonText>
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}
