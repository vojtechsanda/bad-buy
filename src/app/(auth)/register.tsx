import { AuthInlineError } from '@features/auth/components/AuthInlineError';
import { RegisterFormSchema } from '@features/auth/schemas';
import { signUp } from '@features/auth/service';
import { Button, ButtonText, FormField, Input, InputField } from '@shared/components';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { View } from 'react-native';

export default function Register() {
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: '', password: '', passwordRepeat: '' },
    validators: { onChange: RegisterFormSchema },
    onSubmit: async ({ value }) => {
      setAuthError(null);
      try {
        await signUp(value.email, value.password);
        // TODO: start onboarding
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Something went wrong. Please try again.';
        setAuthError(message);
      }
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

      <AuthInlineError message={authError} />

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
