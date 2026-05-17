import { CountrySheet, FormField, SelectFormField } from '@shared/components';
import { AnyFieldApi } from '@tanstack/react-form';
import { useState } from 'react';

import { mockCountries } from '../../store';

type CountryFormFieldProps = { field: AnyFieldApi };

export function CountryFormField({ field }: CountryFormFieldProps) {
  const [showSheet, setShowSheet] = useState(false);
  const [countryName, setCountryName] = useState<string | null>(null);

  return (
    <>
      <FormField field={field} label="Your country">
        <SelectFormField
          onPress={() => setShowSheet(true)}
          value={countryName}
          placeholder="Select your country"
        />
      </FormField>

      <CountrySheet
        countries={mockCountries}
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
        onSelect={(iso2, name) => {
          field.handleChange(iso2);
          field.handleBlur();
          setCountryName(name);
        }}
      />
    </>
  );
}
