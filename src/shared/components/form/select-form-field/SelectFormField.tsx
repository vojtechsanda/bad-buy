import { themeColor } from '@shared/constants';
import { ChevronDown } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';

type SelectFormFieldProps = {
  onPress: () => void;
  value: string | null;
  placeholder: string;
};

export function SelectFormField({ onPress, value, placeholder }: SelectFormFieldProps) {
  return (
    <Pressable
      onPress={onPress}
      className="h-16 flex-row items-center justify-between rounded-md border border-outline-200 bg-background-0 px-3"
    >
      <Text
        className={
          value
            ? 'font-nunito text-xl text-typography-900'
            : 'font-nunito text-xl text-typography-500'
        }
      >
        {value ?? placeholder}
      </Text>
      <ChevronDown size={20} strokeWidth={1.75} color={themeColor.typography400} />
    </Pressable>
  );
}
