import { FormField } from '@shared/components';
import { themeColor } from '@shared/constants';
import { AnyFieldApi } from '@tanstack/react-form';
import { ChevronDown, Info } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, Text } from 'react-native';

import { CountrySheet } from '../CountrySheet';

type CountryFormFieldProps = { field: AnyFieldApi };

export function CountryFormField({ field }: CountryFormFieldProps) {
  const [showSheet, setShowSheet] = useState(false);
  const [countryName, setCountryName] = useState<string | null>(null);

  return (
    <>
      <FormField
        field={field}
        label="Country"
        labelRight={
          <Pressable
            onPress={() =>
              Alert.alert('', 'Helps us suggest alternatives available where you live.')
            }
            hitSlop={8}
          >
            <Info size={14} strokeWidth={2} color={themeColor.typography400} />
          </Pressable>
        }
      >
        <Pressable
          onPress={() => setShowSheet(true)}
          className="h-16 flex-row items-center justify-between rounded-md border border-outline-200 bg-background-0 px-3"
        >
          <Text
            className={
              countryName
                ? 'font-nunito text-xl text-typography-900'
                : 'font-nunito text-xl text-typography-500'
            }
          >
            {countryName ?? 'Select your country'}
          </Text>
          <ChevronDown size={20} strokeWidth={1.75} color={themeColor.typography400} />
        </Pressable>
      </FormField>

      <CountrySheet
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
