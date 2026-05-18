import { Input, InputField } from '@shared/components';
import { FormField } from '@shared/components/form/form-field';
import { AnyFieldApi } from '@tanstack/react-form';
import { Minus, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { StepperButton } from './StepperButton';

type StepperFieldProps = {
  field: AnyFieldApi;
  label: string;
  infoMessage?: string;
  min?: number;
  max?: number;
  step?: number;
};

export function StepperField({
  field,
  label,
  infoMessage,
  min = 1,
  max = 99,
  step = 0.5,
}: StepperFieldProps) {
  const value = field.state.value as number;
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormField field={field} label={label} infoMessage={infoMessage}>
      {(isInvalid) => (
        <View
          className={`h-16 flex-row items-center gap-2 rounded-md border bg-background-0 px-2 ${isInvalid ? 'border-error-700' : isFocused ? 'border-primary-500' : 'border-outline-200'}`}
        >
          <Input className="flex-1 border-0" size="xl">
            <InputField
              value={String(value)}
              onChangeText={(text) => {
                const n = parseFloat(text);
                if (!isNaN(n)) field.handleChange(Math.min(max, Math.max(min, n)));
              }}
              onBlur={() => {
                setIsFocused(false);
                field.handleBlur();
              }}
              onFocus={() => setIsFocused(true)}
              keyboardType="number-pad"
            />
          </Input>
          <StepperButton
            onPress={() => value > min && field.handleChange(value - step)}
            Icon={Minus}
          />
          <StepperButton
            onPress={() => value < max && field.handleChange(value + step)}
            Icon={Plus}
          />
        </View>
      )}
    </FormField>
  );
}
