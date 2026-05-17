import { ScreenContainer } from '@shared/components';
import { StepperField } from '@shared/components/form/stepper-field';
import { revalidateLogic } from '@tanstack/form-core';
import { useForm, useStore } from '@tanstack/react-form';
import { ReactNode } from 'react';
import { View } from 'react-native';

import { MoneyFormData, moneyFormSchema } from '../../schemas';
import { OnboardingStickyFooter } from '../OnboardingStickyFooter';
import { OnboardingTitle } from '../OnboardingTitle';
import { CurrencyFormField } from './CurrencyFormField';
import { WageFormField } from './WageFormField';

type MoneyViewProps = {
  onComplete: (data: MoneyFormData) => void;
  defaultCurrency: string;
  screenHeader?: ReactNode;
};

export function MoneyView({ onComplete, defaultCurrency, screenHeader }: MoneyViewProps) {
  const form = useForm({
    defaultValues: {
      displayCurrency: defaultCurrency,
      hourlyWage: 0,
      wageCurrency: defaultCurrency,
      workHoursPerDay: 8,
    },
    validationLogic: revalidateLogic({ mode: 'submit', modeAfterSubmission: 'change' }),
    validators: { onDynamic: moneyFormSchema },
    onSubmit: async ({ value }) => onComplete(value as MoneyFormData),
  });

  const formValues = useStore(form.store, (s) => s.values);
  const isComplete =
    formValues.displayCurrency.length > 0 &&
    formValues.hourlyWage > 0 &&
    formValues.wageCurrency.length > 0 &&
    formValues.workHoursPerDay >= 1 &&
    formValues.workHoursPerDay <= 16;

  return (
    <ScreenContainer
      header={screenHeader}
      withSafeAreaTop
      stickyBottom={<OnboardingStickyFooter onPress={form.handleSubmit} disabled={!isComplete} />}
    >
      <View className="flex-col gap-8">
        <OnboardingTitle
          title="Your money basics"
          subtitle="We'll never share this. It powers your work-hour calculations."
        />

        <View className="gap-6">
          <form.Field name="displayCurrency">
            {(field) => (
              <CurrencyFormField
                field={field}
                label="Show prices in"
                infoMessage="The currency you'll see prices displayed in throughout the app."
                pinnedCurrency={defaultCurrency}
              />
            )}
          </form.Field>

          <form.Field name="hourlyWage">
            {(wageField) => (
              <form.Field name="wageCurrency">
                {(currencyField) => (
                  <WageFormField
                    wageField={wageField}
                    currencyField={currencyField}
                    pinnedCurrency={formValues.displayCurrency}
                  />
                )}
              </form.Field>
            )}
          </form.Field>

          <form.Field name="workHoursPerDay">
            {(field) => (
              <StepperField
                field={field}
                label="Average work hours per day"
                infoMessage="Helps us put prices in the context of your workday."
                min={1}
                max={16}
              />
            )}
          </form.Field>
        </View>
      </View>
    </ScreenContainer>
  );
}
