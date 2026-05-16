import { ScreenContainer } from '@shared/components';
import { revalidateLogic } from '@tanstack/form-core';
import { useForm, useStore } from '@tanstack/react-form';
import { Text, View } from 'react-native';

import { IdentitySchema , IdentityFormData } from '../../schemas';

import { OnboardingStickyFooter } from '../OnboardingStickyFooter';
import { BirthdateFormField } from './BirthdateFormField';
import { CountryFormField } from './CountryFormField';
import { NameFormField } from './NameFormField';

type IdentityViewProps = {
  onComplete: (data: IdentityFormData) => void;
};

export function IdentityView({ onComplete }: IdentityViewProps) {
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
    validators: { onDynamic: IdentitySchema },
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
      stickyBottom={<OnboardingStickyFooter onPress={form.handleSubmit} disabled={!isComplete} />}
    >
      <View className="flex-col gap-8">
        <View className="gap-1.5">
          <Text className="font-nunito-bold text-display-lg text-typography-900">
            Tell us about you
          </Text>
          <Text className="font-nunito text-heading text-typography-500">
            We'll personalize your experience.
          </Text>
        </View>

        <View className="gap-6">
          <form.Field name="name">{(field) => <NameFormField field={field} />}</form.Field>
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
