import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from '@shared/components/ui/form-control';
import { AnyFieldApi } from '@tanstack/react-form';
import { ReactNode } from 'react';
import { Text } from 'react-native';

type FormFieldProps = {
  field: AnyFieldApi;
  label: string;
  helperText?: string;
  children: ReactNode;
};

export function FormField({ field, label, helperText, children }: FormFieldProps) {
  const errorMessage = field.state.meta.errors[0]?.message;
  const isInvalid = field.state.meta.errors.length > 0;
  const subText = isInvalid ? errorMessage : (helperText ?? '');
  const subTextColor = isInvalid ? 'text-error-700' : 'text-typography-500';

  return (
    <FormControl isInvalid={isInvalid}>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      {children}
      {subText && <Text className={`mt-1 text-xs ${subTextColor}`}>{subText}</Text>}
    </FormControl>
  );
}
