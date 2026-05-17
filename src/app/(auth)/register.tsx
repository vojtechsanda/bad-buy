import { AuthStickyFooter, RegisterFormSchema, authService } from '@features/auth';
import {
  EmailFormField,
  ErrorMessage,
  PasswordFormField,
  ScreenContainer,
} from '@shared/components';
import { DEFAULT_ERROR_MESSAGE } from '@shared/constants';
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
      try {
        await authService.signUp(value.email, value.password);
        router.navigate('/(onboarding)/onboarding');
      } catch (err) {
        // TODO: user friendly error message instead of raw supabase error message
        const message = err instanceof Error ? err.message : DEFAULT_ERROR_MESSAGE;
        setServerError(message);
      }
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

        <ErrorMessage message={serverError} />
      </View>
    </ScreenContainer>
  );
}
