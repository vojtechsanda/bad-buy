import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from '@shared/components/ui/form-control';
import { themeColor } from '@shared/constants';
import { AnyFieldApi } from '@tanstack/react-form';
import { Info } from 'lucide-react-native';
import { ReactNode } from 'react';
import { Alert, Pressable, Text } from 'react-native';

type FormFieldProps = {
  field: AnyFieldApi;
  label?: string;
  helperText?: string;
  infoMessage?: string | { title: string; message: string };
  labelTrailing?: ReactNode;
  children: ReactNode;
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
  const errorMessage = field.state.meta.errors[0]?.message;
  const subText = isInvalid ? errorMessage : (helperText ?? '');
  const subTextColor = isInvalid ? 'text-error-700' : 'text-typography-500';
  const displayLabel = typeof infoMessage === 'object' ? infoMessage.title : (label ?? '');

  const handleInfo = () => {
    if (!infoMessage) return;
    if (typeof infoMessage === 'object') {
      Alert.alert(infoMessage.title, infoMessage.message);
    } else {
      Alert.alert(displayLabel, infoMessage);
    }
  };

  return (
    <FormControl isInvalid={isInvalid}>
      <FormControlLabel className="gap-1.5">
        <FormControlLabelText>{displayLabel}</FormControlLabelText>
        {infoMessage && (
          <Pressable onPress={handleInfo} hitSlop={8}>
            <Info size={14} strokeWidth={2} color={themeColor.typography400} />
          </Pressable>
        )}
        {labelTrailing}
      </FormControlLabel>
      {children}
      {subText ? <Text className={`mt-1 text-xs ${subTextColor}`}>{subText}</Text> : null}
    </FormControl>
  );
}
