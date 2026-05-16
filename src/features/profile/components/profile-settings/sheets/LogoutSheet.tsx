import { BottomSheet, BottomSheetProps, SheetActions, SheetHeader } from '@shared/components';

type LogoutSheetProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'>;

export function LogoutSheet({ isOpen, onClose }: LogoutSheetProps) {
  const handleLogout = () => {
    // TODO: wire to signOut() from auth session (#74)
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <SheetHeader title="Log out?" subtitle="You'll need to log in again to use BadBuy." />
      <SheetActions confirmLabel="Log out" onConfirm={handleLogout} onCancel={onClose} />
    </BottomSheet>
  );
}
