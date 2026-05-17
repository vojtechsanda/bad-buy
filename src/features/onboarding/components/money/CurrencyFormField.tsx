import { mockAvailableCurrencies } from '@features/currency';
import { CurrencyPickerSheet, FormField, SelectFormField } from '@shared/components';
import { AnyFieldApi } from '@tanstack/react-form';
import { useState } from 'react';

type CurrencyFormFieldProps = {
  field: AnyFieldApi;
  label: string;
  infoMessage?: string;
  pinnedCurrency?: string;
};

export function CurrencyFormField({
  field,
  label,
  infoMessage,
  pinnedCurrency,
}: CurrencyFormFieldProps) {
  const [showSheet, setShowSheet] = useState(false);

  const currency = mockAvailableCurrencies.find((c) => c.code === field.state.value);
  const displayValue = currency ? `${currency.code} · ${currency.name}` : field.state.value || null;

  return (
    <>
      <FormField field={field} label={label} infoMessage={infoMessage}>
        <SelectFormField
          onPress={() => setShowSheet(true)}
          value={displayValue}
          placeholder="Select currency"
        />
      </FormField>

      <CurrencyPickerSheet
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
        currencies={mockAvailableCurrencies}
        selectedCurrency={field.state.value}
        onSelect={(code) => {
          field.handleChange(code);
          field.handleBlur();
        }}
        pinnedCurrency={pinnedCurrency}
      />
    </>
  );
}
