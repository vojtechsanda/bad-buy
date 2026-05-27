import { BottomSheet } from '@shared/components/layout';
import { Button, ButtonText } from '@shared/components/ui';
import { themeColor } from '@shared/constants/themeColors';
import { Text } from 'react-native';

type DatePickerProps = {
  isOpen: boolean;
  onClose: () => void;
  value: Date;
  onChange: (date: Date) => void;
  maximumDate?: Date;
};

export function DatePicker({ isOpen, onClose, value, onChange, maximumDate }: DatePickerProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <Text className="mb-4 font-nunito-bold text-heading text-typography-900">Select date</Text>
      <input
        type="date"
        value={value.toLocaleDateString('en-CA')}
        max={maximumDate?.toLocaleDateString('en-CA')}
        onChange={(e) => {
          if (e.target.value) {
            const [year, month, day] = e.target.value.split('-').map(Number);
            onChange(new Date(year, month - 1, day));
          }
        }}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          marginBottom: '16px',
          color: themeColor.typography900,
        }}
      />
      <Button onPress={onClose} className="mt-4">
        <ButtonText className="font-nunito-bold text-white">Done</ButtonText>
      </Button>
    </BottomSheet>
  );
}
