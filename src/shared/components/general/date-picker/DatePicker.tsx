import DateTimePicker from '@react-native-community/datetimepicker';
import { BottomSheet } from '@shared/components/layout';
import { Button, ButtonText } from '@shared/components/ui';
import { Platform, Text } from 'react-native';

type DatePickerProps = {
  isOpen: boolean;
  onClose: () => void;
  value: Date;
  onChange: (date: Date) => void;
  maximumDate?: Date;
};

export function DatePicker({ isOpen, onClose, value, onChange, maximumDate }: DatePickerProps) {
  return (
    <>
      {Platform.OS === 'android' && isOpen && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          maximumDate={maximumDate}
          onValueChange={(_, date) => {
            onClose();
            if (date) onChange(date);
          }}
          onDismiss={onClose}
        />
      )}

      {Platform.OS === 'ios' && (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
          <Text className="mb-4 font-nunito-bold text-heading text-typography-900">
            Select date
          </Text>
          <DateTimePicker
            value={value}
            mode="date"
            display="spinner"
            maximumDate={maximumDate}
            onValueChange={(_, date) => {
              if (date) onChange(date);
            }}
          />
          <Button onPress={onClose} className="mt-4">
            <ButtonText className="font-nunito-bold text-white">Done</ButtonText>
          </Button>
        </BottomSheet>
      )}
    </>
  );
}
