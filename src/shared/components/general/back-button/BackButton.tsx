import { themeColor } from '@shared/constants';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';

type BackButtonProps = {
  onPress: () => void;
};

export function BackButton({ onPress }: BackButtonProps) {
  return (
    <Pressable onPress={onPress} className="-ml-2 rounded-full p-1.5" hitSlop={8}>
      <ChevronLeft size={22} strokeWidth={1.75} color={themeColor.typography900} />
    </Pressable>
  );
}
