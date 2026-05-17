import { InputFormField, ScreenContainer } from '@shared/components';
import { revalidateLogic } from '@tanstack/form-core';
import { useForm, useStore } from '@tanstack/react-form';
import { ReactNode } from 'react';
import { View } from 'react-native';

import { IdentityFormData, identityFormSchema } from '../../schemas';
import { OnboardingStickyFooter } from '../OnboardingStickyFooter';
import { OnboardingTitle } from '../OnboardingTitle';
import { BirthdateFormField } from './BirthdateFormField';
import { CountryFormField } from './CountryFormField';

type IdentityViewProps = {
  onComplete: (data: IdentityFormData) => void;
  screenHeader?: ReactNode;
};

export function IdentityView({ onComplete, screenHeader }: IdentityViewProps) {
  const form = useForm({
    defaultValues: {
      name: '',
      birthdate: undefined as unknown as Date,
      countryIso2: '',
    },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: { onDynamic: identityFormSchema },
    onSubmit: async ({ value }) => {
      console.log('identity', value);
      onComplete(value as IdentityFormData);
    },
  });

  const formValues = useStore(form.store, (s) => s.values);
  const isComplete =
    formValues.name.trim().length > 0 &&
    !!formValues.birthdate &&
    formValues.countryIso2.length > 0;

  return (
    <ScreenContainer
      header={screenHeader}
      withSafeAreaTop
      stickyBottom={<OnboardingStickyFooter onPress={form.handleSubmit} disabled={!isComplete} />}
    >
      <View className="flex-col gap-8">
        <OnboardingTitle title="Tell us about you" subtitle="We'll personalize your experience." />

        <View className="gap-6">
          <form.Field name="name">
            {(field) => (
              <InputFormField
                field={field}
                label="Your name"
                placeholder="How should we call you?"
              />
            )}
          </form.Field>
          <form.Field name="birthdate">
            {(field) => <BirthdateFormField field={field} />}
          </form.Field>
          <form.Field name="countryIso2">
            {(field) => <CountryFormField field={field} />}
          </form.Field>
        </View>
      </View>
    </ScreenContainer>
  );
}
