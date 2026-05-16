import { Button, ButtonText, IButtonProps } from '@shared/components';
import { View } from 'react-native';

type SheetActionsProps = {
  confirmLabel: string;
  onConfirm: () => void;
  cancelLabel?: string;
  onCancel?: () => void;
  isConfirmDisabled?: boolean;
  confirmVariant?: IButtonProps['variant'];
  confirmAction?: IButtonProps['action'];
};

export function SheetActions({
  confirmLabel,
  onConfirm,
  cancelLabel = 'Cancel',
  onCancel,
  isConfirmDisabled = false,
  confirmVariant = 'solid',
  confirmAction = 'primary',
}: SheetActionsProps) {
  return (
    <View className="mt-6 w-full gap-2">
      <Button
        variant={confirmVariant}
        action={confirmAction}
        size="md"
        isDisabled={isConfirmDisabled}
        onPress={onConfirm}
      >
        <ButtonText>{confirmLabel}</ButtonText>
      </Button>
      {onCancel && (
        <Button variant="link" action="primary" size="md" onPress={onCancel}>
          <ButtonText>{cancelLabel}</ButtonText>
        </Button>
      )}
    </View>
  );
}
