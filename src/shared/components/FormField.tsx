import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@shared/components/ui/form-control';
import { AnyFieldApi } from '@tanstack/react-form';

type Props = {
  field: AnyFieldApi;
  label: string;
  children: React.ReactNode;
};

export function FormField({ field, label, children }: Props) {
  const invalid = field.state.meta.errors.length > 0;
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
