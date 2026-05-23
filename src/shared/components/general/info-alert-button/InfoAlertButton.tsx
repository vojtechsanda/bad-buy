import { themeColor } from '@shared/constants';
import { Info } from 'lucide-react-native';
import { Alert, Pressable } from 'react-native';

type InfoAlertButtonProps = {
  title: string;
  message: string;
};

export function InfoAlertButton({ title, message }: InfoAlertButtonProps) {
  return (
    <Pressable onPress={() => Alert.alert(title, message)} hitSlop={8}>
      <Info size={14} strokeWidth={2} color={themeColor.typography400} />
    </Pressable>
  );
}
