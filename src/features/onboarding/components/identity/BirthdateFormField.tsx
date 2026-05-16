import DateTimePicker from '@react-native-community/datetimepicker';
import { BottomSheet, Button, ButtonText, FormField } from '@shared/components';
import { themeColor } from '@shared/constants';
import { AnyFieldApi } from '@tanstack/react-form';
import { ChevronDown, Info } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Platform, Pressable, Text } from 'react-native';

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

type BirthdateFormFieldProps = { field: AnyFieldApi };

export function BirthdateFormField({ field }: BirthdateFormFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <FormField
        field={field}
        label="Birthdate"
        labelRight={
          <Pressable
            onPress={() =>
              Alert.alert('', 'We use this only to personalize content. We never share it.')
            }
            hitSlop={8}
          >
            <Info size={14} strokeWidth={2} color={themeColor.typography400} />
          </Pressable>
        }
      >
        <Pressable
          onPress={() => setShowPicker(true)}
          className="h-16 flex-row items-center justify-between rounded-md border border-outline-200 bg-background-0 px-3"
        >
          <Text
            className={
              field.state.value
                ? 'font-nunito text-xl text-typography-900'
                : 'font-nunito text-xl text-typography-500'
            }
          >
            {field.state.value ? formatDate(field.state.value) : 'Select date'}
          </Text>
          <ChevronDown size={20} strokeWidth={1.75} color={themeColor.typography400} />
        </Pressable>
      </FormField>

      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={field.state.value ?? new Date(2000, 0, 1)}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onValueChange={(_, date) => {
            setShowPicker(false);
            if (date) field.handleChange(date);
          }}
          onDismiss={() => setShowPicker(false)}
        />
      )}

      {Platform.OS === 'ios' && (
        <BottomSheet isOpen={showPicker} onClose={() => setShowPicker(false)}>
          <Text className="mb-4 font-nunito-bold text-heading text-typography-900">
            Select date
          </Text>
          <DateTimePicker
            value={field.state.value ?? new Date(2000, 0, 1)}
            mode="date"
            display="spinner"
            maximumDate={new Date()}
            onValueChange={(_, date) => {
              if (date) field.handleChange(date);
            }}
          />
          <Button onPress={() => setShowPicker(false)} className="mt-4">
            <ButtonText className="font-nunito-bold text-white">Done</ButtonText>
          </Button>
        </BottomSheet>
      )}
    </>
  );
}
