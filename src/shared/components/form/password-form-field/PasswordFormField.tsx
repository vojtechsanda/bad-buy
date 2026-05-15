import { Input, InputField, InputSlot } from '@shared/components/ui/input';
import { themeColor } from '@shared/constants';
import { AnyFieldApi } from '@tanstack/react-form';
import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';

import { FormField } from '../form-field/FormField';

type PasswordFormFieldProps = {
  field: AnyFieldApi;
  label: string;
  helperText?: string;
};

export function PasswordFormField({ field, label, helperText }: PasswordFormFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <FormField field={field} label={label} helperText={helperText}>
      <Input size="3xl">
        <InputField
          value={field.state.value}
          onChangeText={field.handleChange}
          onBlur={field.handleBlur}
          secureTextEntry={!show}
          autoCapitalize="none"
          autoCorrect={false}
          className="text-xl"
        />
        <InputSlot onPress={() => setShow((v) => !v)} className="pr-3">
          {show ? (
            <EyeOff size={20} strokeWidth={1.75} color={themeColor.typography400} />
          ) : (
            <Eye size={20} strokeWidth={1.75} color={themeColor.typography400} />
          )}
        </InputSlot>
      </Input>
    </FormField>
  );
}
