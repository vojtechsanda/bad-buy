import { FormField } from '@shared/components/form/form-field';
import { AnyFieldApi } from '@tanstack/react-form';
import { Minus, Plus } from 'lucide-react-native';
import { TextInput, View } from 'react-native';

import { StepperButton } from './StepperButton';

type StepperFieldProps = {
  field: AnyFieldApi;
  label?: string;
  infoMessage?: string | { title: string; message: string };
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

  return (
    <FormField field={field} label={label} infoMessage={infoMessage}>
      <View className="h-16 flex-row items-center gap-2 rounded-md border border-outline-200 bg-background-0 px-2">
        <TextInput
          value={String(value)}
          onChangeText={(text) => {
            const n = parseFloat(text);
            if (!isNaN(n)) field.handleChange(Math.min(max, Math.max(min, n)));
          }}
          onBlur={() => field.handleBlur()}
          keyboardType="number-pad"
          className="flex-1  font-nunito-bold text-xl text-typography-900"
        />
        <StepperButton
          onPress={() => value > min && field.handleChange(value - step)}
          Icon={Minus}
        />
        <StepperButton
          onPress={() => value < max && field.handleChange(value + step)}
          Icon={Plus}
        />
      </View>
    </FormField>
  );
}
