import { AuthStickyFooter, RegisterFormSchema } from '@features/auth';
import { EmailFormField, PasswordFormField, ScreenContainer } from '@shared/components';
import { revalidateLogic } from '@tanstack/form-core';
import { useForm, useStore } from '@tanstack/react-form';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function Register() {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: '', password: '', passwordRepeat: '' },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: {
      onDynamic: RegisterFormSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      // TODO: Supabase auth call
      console.log('register', value);
    },
  });

  const canSubmit = useStore(form.store, (state) => state.canSubmit);
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

  return (
    <ScreenContainer
      withSafeAreaTop={true}
      stickyBottom={
        <AuthStickyFooter
          ctaLabel="Create account"
          ctaLoadingLabel="Creating..."
          onCtaPress={form.handleSubmit}
          isLoading={isSubmitting}
          ctaDisabled={!canSubmit}
          footerText="Already have an account? "
          footerLinkLabel="Log in"
          onFooterLinkPress={() => router.navigate('/(auth)/login')}
        />
      }
    >
      <View className="flex-col gap-6 pt-12">
        <Text className="font-nunito-bold text-display-lg text-typography-900">
          Create your account
        </Text>
        <form.Field name="email">
          {(field) => <EmailFormField field={field} label="Email" />}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <PasswordFormField field={field} label="Password" helperText="At least 8 characters" />
          )}
        </form.Field>

        <form.Field name="passwordRepeat">
          {(field) => <PasswordFormField field={field} label="Repeat password" />}
        </form.Field>
      </View>

      {serverError && <Text className="mt-4 text-body-sm text-error-500">{serverError}</Text>}
    </ScreenContainer>
  );
}
