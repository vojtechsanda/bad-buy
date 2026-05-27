import DateTimePicker from '@react-native-community/datetimepicker';

type DatePickerProps = {
  isOpen: boolean;
  onClose: () => void;
  value: Date;
  onChange: (date: Date) => void;
  maximumDate?: Date;
};

export function DatePicker({ isOpen, onClose, value, onChange, maximumDate }: DatePickerProps) {
  if (!isOpen) return null;

  return (
    <DateTimePicker
      value={value}
      mode="date"
      display="default"
      maximumDate={maximumDate}
      onChange={(_, date) => {
        onClose();
        if (date) onChange(date);
      }}
    />
  );
}
