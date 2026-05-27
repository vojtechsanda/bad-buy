import { InfoAlertButton } from '@shared/components';
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
  infoMessage?: string;
  labelTrailing?: ReactNode;
  children: ReactNode | ((isInvalid: boolean) => ReactNode);
};

export function FormField({
  field,
  label,
  helperText,
  infoMessage,
  labelTrailing,
  children,
}: FormFieldProps) {
  const hasBeenSubmitted = field.form.state.submissionAttempts > 0;
  const isInvalid =
    (field.state.meta.isTouched || hasBeenSubmitted) && field.state.meta.errors.length > 0;
  const error = field.state.meta.errors[0];
  const errorMessage = typeof error === 'string' ? error : error?.message;
  const subText = isInvalid ? errorMessage : (helperText ?? '');
  const subTextColor = isInvalid ? 'text-error-700' : 'text-typography-500';

  return (
    <FormControl isInvalid={isInvalid}>
      <FormControlLabel className="gap-1.5">
        <FormControlLabelText>{label}</FormControlLabelText>
        {infoMessage && <InfoAlertButton title={label} message={infoMessage} />}

        {labelTrailing}
      </FormControlLabel>
      {typeof children === 'function' ? children(isInvalid) : children}
      {subText ? <Text className={`mt-1 text-xs ${subTextColor}`}>{subText}</Text> : null}
    </FormControl>
  );
}
