import {
  BottomSheet,
  BottomSheetProps,
  Button,
  ButtonText,
  InputFormField,
} from '@shared/components';
import { defaultFormValidationLogic, themeColor } from '@shared/constants';
import { useForm } from '@tanstack/react-form';
import { X } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { z } from 'zod';

type AddCustomHobbySheetProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'> & {
  existingNames: string[];
  onAdd: (name: string) => void;
};

const addHobbySchema = z.object({
  name: z.string().min(1, { message: 'Enter a hobby name' }),
});

export function AddCustomHobbySheet({
  isOpen,
  onClose,
  existingNames,
  onAdd,
}: AddCustomHobbySheetProps) {
  const form = useForm({
    defaultValues: { name: '' },
    validationLogic: defaultFormValidationLogic,
    validators: { onDynamic: addHobbySchema },
    onSubmit: async ({ value }) => {
      onAdd(value.name.trim());
      handleClose();
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose}>
      <View>
        <View className="mb-6 flex-row items-center justify-between">
          <Text className="font-nunito-bold text-heading text-typography-900">Add hobby</Text>
          <Pressable onPress={handleClose} hitSlop={8}>
            <X size={20} color={themeColor.typography400} />
          </Pressable>
        </View>

        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              const trimmed = value.trim();
              if (trimmed && existingNames.includes(trimmed)) {
                return { message: 'This hobby already exists' };
              }
            },
          }}
        >
          {(field) => (
            <InputFormField
              field={field}
              label="Hobby name"
              placeholder="e.g. Bouldering"
              autoCapitalize="words"
              autoCorrect={false}
            />
          )}
        </form.Field>

        <View className="mt-6 border-t border-outline-200 pt-3">
          <Button size="lg" action="primary" onPress={form.handleSubmit}>
            <ButtonText>Add</ButtonText>
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}
