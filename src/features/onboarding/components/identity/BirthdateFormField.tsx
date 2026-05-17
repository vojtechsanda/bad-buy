import { DatePicker, FormField, SelectFormField } from '@shared/components';
import { formatDate } from '@shared/utils';
import { AnyFieldApi } from '@tanstack/react-form';
import { useState } from 'react';

type BirthdateFormFieldProps = { field: AnyFieldApi };

export function BirthdateFormField({ field }: BirthdateFormFieldProps) {
  const [showPicker, setShowPicker] = useState(false);
  const formattedDate = field.state.value ? formatDate(field.state.value) : null;

  return (
    <>
      <FormField field={field} label="Birthdate">
        <SelectFormField
          onPress={() => setShowPicker(true)}
          value={formattedDate}
          placeholder="Select date"
        />
      </FormField>

      <DatePicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        value={field.state.value ?? new Date(2000, 0, 1)}
        onChange={(date) => field.handleChange(date)}
        maximumDate={new Date()}
      />
    </>
  );
}
