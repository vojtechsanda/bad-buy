import { AuthStickyFooter } from '@features/auth/';
import { RegisterFormSchema } from '@features/auth/schemas';
import { EmailFormField, PasswordFormField, ScreenContainer } from '@shared/components';
import { themeColor } from '@shared/constants';
import { useForm, useStore } from '@tanstack/react-form';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function Register() {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: '', password: '', passwordRepeat: '' },
    validators: { onChange: RegisterFormSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      // TODO: Supabase auth call
      console.log('register', value);
    },
  });

  const canSubmit = useStore(form.store, (s) => s.canSubmit);
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

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
          onFooterLinkPress={() => router.push('/(auth)/login')}
          className=" pb-6"
        />
      }>
      <View className="flex-col gap-6">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center"
          hitSlop={8}>
          <ChevronLeft size={24} strokeWidth={1.75} color={themeColor.typography900} />
        </Pressable>

        <Text className="font-nunito-bold text-display-md text-typography-900">
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

      <View className="flex-1" />
    </ScreenContainer>
  );
}
