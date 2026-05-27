import {
  BottomSheet,
  BottomSheetProps,
  CountryFormField,
  CurrencyFormField,
  SheetActions,
  SheetHeader,
  WageFormField,
} from '@shared/components';
import { StepperField } from '@shared/components/form/stepper-field';
import { defaultFormValidationLogic, mockCountries } from '@shared/constants';
import { personalInfoEditSchema } from '@shared/schemas/personalInfo';
import { Account } from '@shared/types';
import { useForm, useStore } from '@tanstack/react-form';
import { ScrollView, View } from 'react-native';

type PersonalInfoEditSheetProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'> & {
  account: Account;
};

export function PersonalInfoEditSheet({ isOpen, onClose, account }: PersonalInfoEditSheetProps) {
  const form = useForm({
    defaultValues: {
      countryIso2: account.country,
      displayCurrency: account.display_currency,
      hourlyWage: account.hourly_wage_usd,
      wageCurrency: account.wage_currency,
      workHoursPerDay: account.work_hours_per_day,
    },
    validationLogic: defaultFormValidationLogic,
    validators: { onDynamic: personalInfoEditSchema },
    onSubmit: async () => {
      // TODO: wire save to Supabase (#121)
      onClose();
    },
  });
  const handleClose = () => {
    form.reset();
    onClose();
  };

  const displayCurrency = useStore(form.store, (s) => s.values.displayCurrency);

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose}>
      <View className="mb-4">
        <SheetHeader title="Edit personal info" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-4">
          <form.Field name="countryIso2">
            {(field) => <CountryFormField field={field} countries={mockCountries} />}
          </form.Field>

          <form.Field name="displayCurrency">
            {(field) => (
              <CurrencyFormField
                field={field}
                label="Show prices in"
                infoMessage="The currency you'll see prices displayed in throughout the app."
                pinnedCurrency={account.display_currency}
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
                min={1}
                max={16}
              />
            )}
          </form.Field>
        </View>
      </ScrollView>

      <SheetActions confirmLabel="Save" onConfirm={form.handleSubmit} onCancel={handleClose} />
    </BottomSheet>
  );
}
