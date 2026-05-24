import { FormField, SelectFormField } from '@shared/components';
import { CurrencySheet, currencyService } from '@shared/modules/currency';
import { type Currency } from '@shared/types';
import { AnyFieldApi } from '@tanstack/react-form';
import { useEffect, useState } from 'react';

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
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    currencyService.listCurrencies().then(setCurrencies);
  }, []);

  const currency = currencies.find((c) => c.code === field.state.value);
  const displayValue = currency ? `${currency.code} · ${currency.name}` : field.state.value || null;

  return (
    <>
      <FormField field={field} label={label} infoMessage={infoMessage}>
        {(isInvalid) => (
          <SelectFormField
            onPress={() => setShowSheet(true)}
            value={displayValue}
            placeholder="Select currency"
            isInvalid={isInvalid}
          />
        )}
      </FormField>

      <CurrencySheet
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
        selectedCurrency={field.state.value}
        onSelect={(code) => {
          field.handleChange(code);
          field.handleBlur();
        }}
        currencies={currencies}
        pinnedCurrency={pinnedCurrency}
      />
    </>
  );
}
