import { RegisterInput, RegisterSchema } from '@features/auth/schemas';
import { isLogged } from '@features/auth/store';
import { FormField } from '@shared/components/FormField';
import { Button, ButtonText } from '@shared/components/ui/button';
import { Input, InputField } from '@shared/components/ui/input';
import { useForm } from '@tanstack/react-form';
import { Redirect } from 'expo-router';
import { View } from 'react-native';

export default function Register() {
  const form = useForm({
    defaultValues: { email: '', password: '', passwordRepeat: '' } as RegisterInput,
    validators: { onChange: RegisterSchema },
    onSubmit: async ({ value }) => {
      console.log('register', value);
    },
  });

  if (isLogged) return <Redirect href="/(app)/home" />;

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
