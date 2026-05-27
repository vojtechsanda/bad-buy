import { FormField } from '@shared/components/form/form-field';
import { Button, ButtonText, Input, InputField } from '@shared/components/ui';
import { useForm } from '@tanstack/react-form';
import { View } from 'react-native';

type AddCustomHobbyFormProps = {
  onAdd: (name: string) => void;
};

export function AddCustomHobbyForm({ onAdd }: AddCustomHobbyFormProps) {
  const form = useForm({
    defaultValues: { name: '' },
    onSubmit: async ({ value }) => {
      onAdd(value.name.trim());
      form.reset();
    },
  });

  return (
    <form.Field
      name="name"
      validators={{
        onBlur: ({ value }) => (!value.trim() ? 'Please enter a hobby name' : undefined),
        onChange: ({ value }) => (!value.trim() ? 'Please enter a hobby name' : undefined),
      }}
    >
      {(field) => (
        <FormField field={field} label="Custom hobby">
          <View className="flex-row gap-2">
            <View className="flex-1" style={{ minWidth: 0 }}>
              <Input size="3xl">
                <InputField
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="Add a hobby…"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={form.handleSubmit}
                  className="text-xl"
                />
              </Input>
            </View>
            <Button size="lg" action="primary" variant="outline" onPress={form.handleSubmit}>
              <ButtonText>Add</ButtonText>
            </Button>
          </View>
        </FormField>
      )}
    </form.Field>
  );
}
