import { Button, ButtonText, SwipeToConfirm } from '@shared/components';
import { themeColor } from '@shared/constants';
import { ShoppingBag, Snowflake } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { FreezeSheet } from './freeze-sheet/FreezeSheet';

type AuditStickyFooterProps = {
  freezeLabel?: string;
  onSkip: () => void;
  onFreeze: (name: string, durationMs: number) => void;
  onBuy: () => void;
};

export function AuditStickyFooter({
  onSkip,
  onBuy,
  onFreeze,
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

      <FreezeSheet
        isOpen={freezeSheetOpen}
        onClose={() => setFreezeSheetOpen(false)}
        onFreeze={onFreeze}
      />
    </View>
  );
}
