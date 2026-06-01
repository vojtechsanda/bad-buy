import {
  CountryFormField,
  FullSizeError,
  FullSizeSpinner,
  InputFormField,
  ScreenContainer,
} from '@shared/components';
import { defaultFormValidationLogic } from '@shared/constants';
import { useCountriesSWR } from '@shared/modules/country';
import { USD_CODE } from '@shared/modules/currency';
import { useForm } from '@tanstack/react-form';
import { ReactNode } from 'react';
import { View } from 'react-native';

import { IdentityFormData, identityFormSchema } from '../../schemas';
import { OnboardingStickyFooter } from '../OnboardingStickyFooter';
import { OnboardingTitle } from '../OnboardingTitle';
import { BirthdateFormField } from './BirthdateFormField';

type IdentityViewProps = {
  onComplete: (data: IdentityFormData, currency: string) => void;
  screenHeader?: ReactNode;
  defaultValues?: IdentityFormData;
};

export function IdentityView({ onComplete, screenHeader, defaultValues }: IdentityViewProps) {
  const { countries, isLoading: isCountriesLoading } = useCountriesSWR();

  const form = useForm({
    defaultValues: {
      name: defaultValues?.name ?? '',
      birthdate: defaultValues?.birthdate ?? (undefined as unknown as Date),
      countryIso2: defaultValues?.countryIso2 ?? '',
    },
    validationLogic: defaultFormValidationLogic,
    validators: { onDynamic: identityFormSchema },
    onSubmit: async ({ value }) => {
      if (isCountriesLoading) return;

      const countryDetail = countries?.find((country) => country.iso2 === value.countryIso2);

      onComplete(value, countryDetail?.currency ?? USD_CODE);
    },
  });

  if (isCountriesLoading) return <FullSizeSpinner />;
  if (!countries) {
    return <FullSizeError message="Failed to load countries. Please try again later." />;
  }

  return (
    <ScreenContainer
      header={screenHeader}
      withSafeAreaTop
      stickyBottom={<OnboardingStickyFooter onPress={form.handleSubmit} />}
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
            {(field) => <CountryFormField field={field} countries={countries} />}
          </form.Field>
        </View>
      </View>
    </ScreenContainer>
  );
}
