import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@shared/components/ui/form-control';
import { AnyFieldApi } from '@tanstack/react-form';
import { ReactNode } from 'react';

type FormFieldProps = {
  field: AnyFieldApi;
  label: string;
  infoTooltip?: string;
  children: ReactNode;
};

export function FormField({ field, label, children }: FormFieldProps) {
  const invalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  return (
    <FormControl isInvalid={invalid}>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      {children}
      <FormControlError>
        <FormControlErrorText>{field.state.meta.errors[0]?.message}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
}
