import { Input, InputField } from '@shared/components/ui/input';
import { AnyFieldApi } from '@tanstack/react-form';

import { FormField } from '../form-field/FormField';

type EmailFormFieldProps = {
  field: AnyFieldApi;
  label?: string;
};

export function EmailFormField({ field, label = 'Email' }: EmailFormFieldProps) {
  return (
    <FormField field={field} label={label}>
      <Input size="3xl">
        <InputField
          value={field.state.value}
          onChangeText={field.handleChange}
          onBlur={field.handleBlur}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          className="text-xl"
        />
      </Input>
    </FormField>
  );
}
