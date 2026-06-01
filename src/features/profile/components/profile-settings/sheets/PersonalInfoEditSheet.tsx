import {
  BottomSheet,
  BottomSheetProps,
  CountryFormField,
  CurrencyFormField,
  FullSizeError,
  FullSizeSpinner,
  SheetActions,
  SheetHeader,
  WageFormField,
} from '@shared/components';
import { StepperField } from '@shared/components/form/stepper-field';
import { defaultFormValidationLogic } from '@shared/constants';
import { accountService, useAccountSWR } from '@shared/modules/account';
import { useCountriesSWR } from '@shared/modules/country';
import { convertFromUsd, convertToUsd } from '@shared/modules/currency';
import { PersonalInfoEditData, personalInfoEditSchema } from '@shared/schemas/personalInfo';
import { Account } from '@shared/types';
import { useForm, useStore } from '@tanstack/react-form';
import { Alert, ScrollView, View } from 'react-native';

type PersonalInfoEditSheetProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'> & {
  account: Account;
};

export function PersonalInfoEditSheet({ isOpen, onClose, account }: PersonalInfoEditSheetProps) {
  const { countries, isLoading: isCountriesLoading } = useCountriesSWR();
  const { invalidateAccount } = useAccountSWR();

  const handleSubmit = async (data: PersonalInfoEditData) => {
    try {
      await accountService.update({
        country: data.countryIso2,
        display_currency: data.displayCurrency,
        hourly_wage_usd: convertToUsd(data.hourlyWage, data.wageCurrency),
        wage_currency: data.wageCurrency,
        work_hours_per_day: data.workHoursPerDay,
      });

      invalidateAccount();
      onClose();
    } catch (e) {
      console.error(JSON.stringify(e));

      Alert.alert('Error', "Couldn't edit personal info, please try again later.");
    }
  };

  const form = useForm({
    defaultValues: {
      countryIso2: account.country,
      displayCurrency: account.display_currency,
      hourlyWage: convertFromUsd(account.hourly_wage_usd, account.wage_currency),
      wageCurrency: account.wage_currency,
      workHoursPerDay: account.work_hours_per_day,
    },
    validationLogic: defaultFormValidationLogic,
    validators: { onDynamic: personalInfoEditSchema },
    onSubmit: async ({ value }) => handleSubmit(value),
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
        {isCountriesLoading && <FullSizeSpinner />}
        {!isCountriesLoading && !countries && (
          <FullSizeError message="Couldn't load countries, please try again later." />
        )}
        {!isCountriesLoading && countries && (
          <View className="gap-6 pb-4">
            <form.Field name="countryIso2">
              {(field) => <CountryFormField field={field} countries={countries} />}
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
        )}
      </ScrollView>

      <SheetActions confirmLabel="Save" onConfirm={form.handleSubmit} onCancel={handleClose} />
    </BottomSheet>
  );
}
