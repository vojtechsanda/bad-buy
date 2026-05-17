import { CountrySheet, FormField, SelectFormField } from '@shared/components';
import { AnyFieldApi } from '@tanstack/react-form';
import { useState } from 'react';

import { mockCountries } from '../../store';

type CountryFormFieldProps = { field: AnyFieldApi };

export function CountryFormField({ field }: CountryFormFieldProps) {
  const [showSheet, setShowSheet] = useState(false);

  const selected = field.state.value
    ? (mockCountries.find((c) => c.iso2 === field.state.value) ?? null)
    : null;
  const displayValue = selected ? `${selected.flag} ${selected.name}` : null;

  return (
    <>
      <FormField field={field} label="Your country">
        <SelectFormField
          onPress={() => setShowSheet(true)}
          value={displayValue}
          placeholder="Select your country"
        />
      </FormField>

      <CountrySheet
        countries={mockCountries}
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
