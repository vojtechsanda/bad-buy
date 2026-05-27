import { InInputButton } from '@shared/components';
import { FormField } from '@shared/components/form/form-field';
import { Input, InputField } from '@shared/components/ui';
import { defaultFormValidationLogic } from '@shared/constants';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { View } from 'react-native';
import { z } from 'zod';

const addCustomHobbyFormSchema = z.object({
  name: z.string().trim().min(2, { message: 'Please enter a hobby name' }),
});

type AddCustomHobbyFormProps = {
  onAdd: (name: string) => void;
};

export function AddCustomHobbyForm({ onAdd }: AddCustomHobbyFormProps) {
  const [isFocused, setIsFocused] = useState(false);

  const form = useForm({
    defaultValues: { name: '' },
    validationLogic: defaultFormValidationLogic,
    validators: { onDynamic: addCustomHobbyFormSchema },
    onSubmit: async ({ value }) => {
      onAdd(value.name.trim());
      form.reset();
    },
  });

  return (
    <form.Field name="name">
      {(field) => (
        <FormField field={field} label="Custom hobby">
          {(isInvalid) => (
            <View
              className={`h-16 flex-row items-center gap-2 rounded-md border bg-background-0 px-2 ${isInvalid ? 'border-error-700' : isFocused ? 'border-primary-500' : 'border-outline-200'}`}
            >
              <Input className="flex-1 border-0" size="xl">
                <InputField
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={() => {
                    field.handleBlur();
                    setIsFocused(false);
                  }}
                  onFocus={() => setIsFocused(true)}
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={form.handleSubmit}
                />
              </Input>
              <InInputButton onPress={form.handleSubmit} content="Add" />
            </View>
          )}
        </FormField>
      )}
    </form.Field>
  );
}
