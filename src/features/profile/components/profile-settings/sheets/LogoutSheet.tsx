import { authService } from '@features/auth';
import { BottomSheet, BottomSheetProps, SheetActions, SheetHeader } from '@shared/components';
import { Alert } from 'react-native';
import { useSWRConfig } from 'swr';

type LogoutSheetProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'>;

export function LogoutSheet({ isOpen, onClose }: LogoutSheetProps) {
  const { mutate } = useSWRConfig();

  const handleLogout = async () => {
    try {
      await authService.signOut();
      mutate(() => true, undefined, { revalidate: false });

      onClose();
    } catch (e) {
      console.error(JSON.stringify(e));

      Alert.alert('Error', "Couldn't log out, please try again later.");
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <SheetHeader title="Log out?" subtitle="You'll need to log in again to use BadBuy." />
      <SheetActions confirmLabel="Log out" onConfirm={handleLogout} onCancel={onClose} />
    </BottomSheet>
  );
}
