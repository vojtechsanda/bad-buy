import { FormField } from '@shared/components/form/form-field';
import { themeColor } from '@shared/constants';
import { AnyFieldApi } from '@tanstack/react-form';
import { LucideIcon, Minus, Plus } from 'lucide-react-native';
import { Pressable, TextInput, View } from 'react-native';

type StepperButtonProps = { onPress: () => void; Icon: LucideIcon };

function StepperButton({ onPress, Icon }: StepperButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="h-11 w-11 items-center justify-center rounded-xl bg-primary-50"
    >
      <Icon size={18} strokeWidth={2} color={themeColor.primary500} />
    </Pressable>
  );
}

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
  step = 1,
}: StepperFieldProps) {
  const value = field.state.value as number;

  return (
    <FormField field={field} label={label} infoMessage={infoMessage}>
      <View className="h-14 flex-row items-center gap-2 rounded-xl border border-outline-200 bg-background-0 p-1">
        <StepperButton
          onPress={() => value > min && field.handleChange(value - step)}
          Icon={Minus}
        />
        <TextInput
          value={String(value)}
          onChangeText={(text) => {
            const n = parseInt(text, 10);
            if (!isNaN(n)) field.handleChange(Math.min(max, Math.max(min, n)));
          }}
          onBlur={() => field.handleBlur()}
          keyboardType="number-pad"
          className="flex-1 text-center font-nunito-bold text-xl text-typography-900"
        />
        <StepperButton
          onPress={() => value < max && field.handleChange(value + step)}
          Icon={Plus}
        />
      </View>
    </FormField>
  );
}
