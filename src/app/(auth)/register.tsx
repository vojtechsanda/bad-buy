import { RegisterFormSchema, RegisterInput } from '@features/auth/schemas';
import { Button, ButtonText, FormField, Input, InputField } from '@shared/components';
import { useForm } from '@tanstack/react-form';
import { View } from 'react-native';

export default function Register() {
  const form = useForm({
    defaultValues: { email: '', password: '', passwordRepeat: '' } as RegisterInput,
    validators: { onChange: RegisterFormSchema },
    onSubmit: async ({ value }) => {
      console.log('register', value);
    },
  });

  return (
    <View className="pt-24">
      <form.Field name="email">
        {(field) => (
          <FormField field={field} label="Email">
            <Input>
              <InputField
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Input>
          </FormField>
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <FormField field={field} label="Password">
            <Input>
              <InputField
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                secureTextEntry
              />
            </Input>
          </FormField>
        )}
      </form.Field>

      <form.Field name="passwordRepeat">
        {(field) => (
          <FormField field={field} label="Repeat password">
            <Input>
              <InputField
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                secureTextEntry
              />
            </Input>
          </FormField>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button onPress={form.handleSubmit} isDisabled={!canSubmit || isSubmitting}>
            <ButtonText>{isSubmitting ? 'Creating...' : 'Create account'}</ButtonText>
          </Button>
        )}
      </form.Subscribe>
    </View>
  );
}
