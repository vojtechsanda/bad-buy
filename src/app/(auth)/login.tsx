import { AuthStickyFooter, LoginFormSchema } from '@features/auth';
import { EmailFormField, PasswordFormField, ScreenContainer } from '@shared/components';
import { revalidateLogic } from '@tanstack/form-core';
import { useForm, useStore } from '@tanstack/react-form';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function Login() {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: {
      onDynamic: LoginFormSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      // TODO: Supabase auth call
      console.log('login', value);
    },
  });

  const canSubmit = useStore(form.store, (state) => state.canSubmit);
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

  return (
    <ScreenContainer
      withSafeAreaTop={true}
      stickyBottom={
        <AuthStickyFooter
          ctaLabel="Log in"
          ctaLoadingLabel="Logging in..."
          onCtaPress={form.handleSubmit}
          isLoading={isSubmitting}
          ctaDisabled={!canSubmit}
          footerText="Don't have an account? "
          footerLinkLabel="Sign up"
          onFooterLinkPress={() => router.navigate('/(auth)/register')}
        />
      }>
      <View className="flex-col gap-6 pt-12">
        <Text className="font-nunito-bold text-display-lg text-typography-900">Welcome back</Text>
        <form.Field name="email">
          {(field) => <EmailFormField field={field} label="Email" />}
        </form.Field>

        <form.Field name="password">
          {(field) => <PasswordFormField field={field} label="Password" />}
        </form.Field>
      </View>

      {serverError && <Text className="mt-4 text-body-sm text-error-500">{serverError}</Text>}
    </ScreenContainer>
  );
}
