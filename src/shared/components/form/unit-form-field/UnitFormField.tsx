import { FormField } from '@shared/components/form/form-field';
import { SelectFormField } from '@shared/components/form/select-form-field';
import { Input, InputField } from '@shared/components/ui';
import { AnyFieldApi } from '@tanstack/react-form';
import { useState } from 'react';
import { View } from 'react-native';

type UnitFormFieldProps = {
  amountField: AnyFieldApi;
  unitField: AnyFieldApi;
  label: string;
  infoMessage?: string;
  placeholder?: string;
  onUnitPress: () => void;
  unitPlaceholder?: string;
};

export function UnitFormField({
  amountField,
  unitField,
  label,
  infoMessage,
  placeholder = '0',
  onUnitPress,
  unitPlaceholder = '—',
}: UnitFormFieldProps) {
  const [amountText, setAmountText] = useState(
    amountField.state.value > 0 ? String(amountField.state.value) : '',
  );

  return (
    <FormField field={amountField} label={label} infoMessage={infoMessage}>
      <View className="flex-row gap-2">
        <View style={{ flex: 7 }}>
          <Input size="3xl">
            <InputField
              value={amountText}
              onChangeText={(text) => {
                setAmountText(text);
                const n = parseFloat(text);
                amountField.handleChange(isNaN(n) ? 0 : n);
              }}
              onBlur={() => amountField.handleBlur()}
              keyboardType="decimal-pad"
              placeholder={placeholder}
              className="text-xl"
            />
          </Input>
        </View>
        <View style={{ flex: 3 }}>
          <SelectFormField
            onPress={onUnitPress}
            value={unitField.state.value || null}
            placeholder={unitPlaceholder}
          />
        </View>
      </View>
    </FormField>
  );
}
