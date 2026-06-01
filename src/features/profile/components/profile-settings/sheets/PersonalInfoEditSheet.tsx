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
import { auditService } from '@shared/modules/audit';
import { useCountriesSWR } from '@shared/modules/country';
import { useConvertFromUsd, useConvertToUsd } from '@shared/modules/currency';
import { personalInfoEditSchema } from '@shared/schemas/personalInfo';
import { Account } from '@shared/types';
import { useForm, useStore } from '@tanstack/react-form';
import { Alert, ScrollView, View } from 'react-native';

type PersonalInfoEditSheetProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'> & {
  account: Account;
};

export function PersonalInfoEditSheet({ isOpen, onClose, account }: PersonalInfoEditSheetProps) {
  const { countries, isLoading: isCountriesLoading } = useCountriesSWR();
  const { invalidateAccount } = useAccountSWR();
  const { convertFromUsd } = useConvertFromUsd();
  const { convertToUsd } = useConvertToUsd();

  const form = useForm({
    defaultValues: {
      countryIso2: account.country,
      displayCurrency: account.display_currency,
      hourlyWage: convertFromUsd(
        account.hourly_wage_usd,
        account.wage_currency,
        account.wage_rate_snapshot,
      ),
      wageCurrency: account.wage_currency,
      workHoursPerDay: account.work_hours_per_day,
    },
    validationLogic: defaultFormValidationLogic,
    validators: { onDynamic: personalInfoEditSchema },
    onSubmit: async ({ value }) => {
      try {
        const countryChanged = value.countryIso2 !== account.country;

        const updated = await accountService.update({
          country: value.countryIso2,
          display_currency: value.displayCurrency,
          hourly_wage_usd: convertToUsd(value.hourlyWage, value.wageCurrency),
          wage_currency: value.wageCurrency,
          work_hours_per_day: value.workHoursPerDay,
        });

        await invalidateAccount(updated, { revalidate: false });

        if (countryChanged) {
          auditService.triggerBackgroundSuggestionsRefresh();
        }

        onClose();
      } catch {
        Alert.alert('Error', "Couldn't save your info, please try again.");
      }
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
