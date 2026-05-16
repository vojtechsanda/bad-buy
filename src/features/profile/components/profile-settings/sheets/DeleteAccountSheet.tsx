import { BottomSheet, BottomSheetProps, SheetActions, SheetHeader } from '@shared/components';
import { themeColor } from '@shared/constants';
import { TriangleAlert } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

type DeleteAccountSheetProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'>;

export function DeleteAccountSheet({ isOpen, onClose }: DeleteAccountSheetProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    // TODO: wire account deletion
    // TODO: call signOut() after deletion so root navigation reacts (#74)
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} showHandle={!isDeleting}>
      {isDeleting ? (
        // TODO(#127): Implement unified loader with title
        <SheetHeader
          title="Deleting account..."
          icon={
            <View className="items-center pb-2 pt-4">
              <ActivityIndicator size="large" />
            </View>
          }
        />
      ) : (
        <>
          <SheetHeader
            title="Delete your account?"
            subtitle="This will permanently delete all your data, decisions and any Premium time you have left. This cannot be undone."
            titleClassName="text-error-500"
            icon={
              <View className="rounded-full bg-error-100 p-3">
                <TriangleAlert size={24} strokeWidth={1.75} color={themeColor.error500} />
              </View>
            }
          />
          <SheetActions
            confirmLabel="Yes, delete my account"
            onConfirm={handleDelete}
            confirmAction="negative"
            onCancel={handleClose}
          />
        </>
      )}
    </BottomSheet>
  );
}
