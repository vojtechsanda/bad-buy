import { type Country, CountrySheet, FormField, SelectFormField } from '@shared/components';
import { AnyFieldApi } from '@tanstack/react-form';
import { useState } from 'react';

type CountryFormFieldProps = { field: AnyFieldApi; countries: Country[] };

export function CountryFormField({ field, countries }: CountryFormFieldProps) {
  const [showSheet, setShowSheet] = useState(false);

  const selected = field.state.value
    ? (countries.find((c) => c.iso2 === field.state.value) ?? null)
    : null;
  const displayValue = selected ? `${selected.flag} ${selected.name}` : null;

  return (
    <>
      <FormField field={field} label="Your country">
        {(isInvalid) => (
          <SelectFormField
            onPress={() => setShowSheet(true)}
            value={displayValue}
            placeholder="Select your country"
            isInvalid={isInvalid}
          />
        )}
      </FormField>

      <CountrySheet
        countries={countries}
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
        onSelect={(iso2) => {
          field.handleChange(iso2);
          field.handleBlur();
        }}
      />
    </>
  );
}
