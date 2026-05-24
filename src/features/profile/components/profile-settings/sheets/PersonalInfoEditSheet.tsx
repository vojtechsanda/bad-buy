import {
  BottomSheet,
  BottomSheetProps,
  Button,
  ButtonText,
  CountryFormField,
  CurrencyFormField,
  WageFormField,
} from '@shared/components';
import { StepperField } from '@shared/components/form/stepper-field';
import { defaultFormValidationLogic, themeColor } from '@shared/constants';
import { personalInfoEditSchema } from '@shared/schemas/personalInfo';
import { Account } from '@shared/types';
import { useForm, useStore } from '@tanstack/react-form';
import { X } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

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
    <BottomSheet isOpen={isOpen} onClose={handleClose} heightMode={0.92}>
      <View style={{ flex: 1 }}>
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-nunito-bold text-heading text-typography-900">
            Edit personal info
          </Text>
          <Pressable onPress={handleClose} hitSlop={8}>
            <X size={20} color={themeColor.typography400} />
          </Pressable>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View className="gap-6 pb-4">
            <form.Field name="countryIso2">
              {(field) => <CountryFormField field={field} />}
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

        <View className="border-t border-outline-200 pt-3">
          <Button size="lg" action="primary" onPress={form.handleSubmit}>
            <ButtonText>Save</ButtonText>
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}
