import { FormField } from '@shared/components/form/form-field';
import { Input, InputField } from '@shared/components/ui';
import { AnyFieldApi } from '@tanstack/react-form';

type InputFormFieldProps = {
  field: AnyFieldApi;
  label: string;
  placeholder?: string;
  infoMessage?: string;
  autoCorrect?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

export function InputFormField({
  field,
  label,
  placeholder,
  infoMessage,
  autoCorrect = true,
  autoCapitalize = 'sentences',
}: InputFormFieldProps) {
  return (
    <FormField field={field} label={label} infoMessage={infoMessage}>
      <Input size="3xl">
        <InputField
          value={field.state.value}
          onChangeText={field.handleChange}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          autoCorrect={autoCorrect}
          autoCapitalize={autoCapitalize}
          className="text-xl"
        />
      </Input>
    </FormField>
  );
}
