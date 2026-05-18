import { ScreenContainer } from '@shared/components';
import { StepperField } from '@shared/components/form/stepper-field';
import { defaultFormValidationLogic } from '@shared/constants';
import { useForm, useStore } from '@tanstack/react-form';
import { ReactNode } from 'react';
import { View } from 'react-native';

import { moneyFormData, moneyFormSchema } from '../../schemas';
import { OnboardingStickyFooter } from '../OnboardingStickyFooter';
import { OnboardingTitle } from '../OnboardingTitle';
import { CurrencyFormField } from './CurrencyFormField';
import { WageFormField } from './WageFormField';

type MoneyViewProps = {
  onComplete: (data: moneyFormData) => void;
  defaultCurrency: string;
  screenHeader?: ReactNode;
  defaultValues?: moneyFormData;
};

export function MoneyView({
  onComplete,
  defaultCurrency,
  screenHeader,
  defaultValues,
}: MoneyViewProps) {
  const form = useForm({
    defaultValues: {
      displayCurrency: defaultValues?.displayCurrency ?? defaultCurrency,
      hourlyWage: defaultValues?.hourlyWage ?? 0,
      wageCurrency: defaultValues?.wageCurrency ?? defaultCurrency,
      workHoursPerDay: defaultValues?.workHoursPerDay ?? 8,
    },
    validationLogic: defaultFormValidationLogic,
    validators: { onDynamic: moneyFormSchema },
    onSubmit: async ({ value }) => onComplete(value),
  });

  const displayCurrency = useStore(form.store, (s) => s.values.displayCurrency);

  return (
    <ScreenContainer
      header={screenHeader}
      withSafeAreaTop
      stickyBottom={<OnboardingStickyFooter onPress={form.handleSubmit} />}
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
                    pinnedCurrency={displayCurrency}
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
                min={0.5}
                max={24}
              />
            )}
          </form.Field>
        </View>
      </View>
    </ScreenContainer>
  );
}
