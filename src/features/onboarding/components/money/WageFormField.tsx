import { mockAvailableCurrencies } from '@features/currency';
import { CurrencyPickerSheet, UnitFormField } from '@shared/components';
import { AnyFieldApi } from '@tanstack/react-form';
import { useState } from 'react';

type WageFormFieldProps = {
  wageField: AnyFieldApi;
  currencyField: AnyFieldApi;
  pinnedCurrency?: string;
};

export function WageFormField({ wageField, currencyField, pinnedCurrency }: WageFormFieldProps) {
  const [showSheet, setShowSheet] = useState(false);

  return (
    <>
      <UnitFormField
        amountField={wageField}
        unitField={currencyField}
        label="Your hourly wage"
        infoMessage="We use this to convert prices into hours of work. We never share it."
        onUnitPress={() => setShowSheet(true)}
      />

      <CurrencyPickerSheet
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
        currencies={mockAvailableCurrencies}
        selectedCurrency={currencyField.state.value}
        onSelect={(code) => {
          currencyField.handleChange(code);
          currencyField.handleBlur();
        }}
        pinnedCurrency={pinnedCurrency}
      />
    </>
  );
}
