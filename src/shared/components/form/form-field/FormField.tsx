import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '@shared/components/ui/form-control';
import { AnyFieldApi } from '@tanstack/react-form';
import { ReactNode } from 'react';

type FormFieldProps = {
  field: AnyFieldApi;
  label: string;
  helperText?: string;
  children: ReactNode;
};

export function FormField({ field, label, helperText, children }: FormFieldProps) {
  const invalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <FormControl isInvalid={invalid}>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      {children}
      {helperText && !invalid && (
        <FormControlHelper>
          <FormControlHelperText>{helperText}</FormControlHelperText>
        </FormControlHelper>
      )}
      <FormControlError>
        <FormControlErrorText>{field.state.meta.errors[0]?.message}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
}
