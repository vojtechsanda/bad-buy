import { FormField, Input, InputField } from '@shared/components';
import { themeColor } from '@shared/constants';
import { AnyFieldApi } from '@tanstack/react-form';
import { Info } from 'lucide-react-native';
import { Alert, Pressable } from 'react-native';

type NameFormFieldProps = { field: AnyFieldApi };

export function NameFormField({ field }: NameFormFieldProps) {
  return (
    <FormField
      field={field}
      label="Your name"
      labelRight={
        <Pressable
          onPress={() => Alert.alert('', 'We use your name to personalize your experience.')}
          hitSlop={8}
        >
          <Info size={14} strokeWidth={2} color={themeColor.typography400} />
        </Pressable>
      }
    >
      <Input size="3xl">
        <InputField
          value={field.state.value}
          onChangeText={field.handleChange}
          onBlur={field.handleBlur}
          placeholder="How should we call you?"
          autoCorrect={false}
          className="text-xl"
        />
      </Input>
    </FormField>
  );
}
