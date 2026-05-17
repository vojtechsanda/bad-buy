import { BottomSheet, BottomSheetProps, ErrorMessage, Input, InputField } from '@shared/components';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { SheetActions } from '../sheet-actions';
import { SheetHeader } from '../sheet-header';

type PromoRedemptionSheetProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'>;

export function PromoRedemptionSheet({ isOpen, onClose }: PromoRedemptionSheetProps) {
  const [sheetState, setSheetState] = useState<'input' | 'success'>('input');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mockMothsGranted: number = 3;

  const handleClose = () => {
    onClose();

    setTimeout(() => {
      setSheetState('input');
      setCode('');
      setError(null);
    }, 300);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose}>
      {sheetState === 'success' && (
        <>
          <SheetHeader
            title="Premium unlocked!"
            subtitle={`${mockMothsGranted} month${mockMothsGranted === 1 ? '' : 's'} of Premium added to your account.`}
            icon={<Text className="font-nunito text-display-xl">🎉</Text>}
          />
          <SheetActions confirmLabel="Done" onConfirm={handleClose} />
        </>
      )}

      {sheetState === 'input' && (
        <>
          <SheetHeader title="Got a code?" subtitle="Enter your promo or referral code." />

          <View className="mt-6">
            <Input size="3xl">
              <InputField
                value={code}
                onChangeText={(text) => {
                  setCode(text.toUpperCase());
                  setError(null);
                }}
                placeholder="ENTER CODE"
                autoCapitalize="characters"
                autoCorrect={false}
                textAlign="center"
                className="font-mono text-xl tracking-widest"
              />
            </Input>
            <ErrorMessage message={error} />
          </View>

          <SheetActions
            confirmLabel="Redeem"
            onConfirm={() => {
              // TODO: wire to redeem-code Edge Function (#119)
              setSheetState('success');
            }}
            isConfirmDisabled={code.length === 0}
            onCancel={handleClose}
          />
        </>
      )}
    </BottomSheet>
  );
}
