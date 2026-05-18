import { themeColor } from '@shared/constants';
import { LucideIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';

type StepperButtonProps = { onPress: () => void; Icon: LucideIcon };

export function StepperButton({ onPress, Icon }: StepperButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="h-11 w-11 items-center justify-center rounded-md bg-secondary-100"
    >
      <Icon size={18} strokeWidth={2} color={themeColor.typography900} />
    </Pressable>
  );
}
