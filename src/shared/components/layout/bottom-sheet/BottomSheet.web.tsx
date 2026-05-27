import { UIActionsheet } from '@shared/components/ui/actionsheet';
import { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  heightMode?: 'auto' | number;
  children: ReactNode;
  showHandle?: boolean;
};

export function BottomSheet({
  isOpen,
  onClose,
  heightMode = 'auto',
  children,
  showHandle = true,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const snapPoints = typeof heightMode === 'number' ? [heightMode * 100] : undefined;

  return (
    <UIActionsheet isOpen={isOpen} onClose={onClose} snapPoints={snapPoints}>
      <UIActionsheet.Backdrop className="absolute inset-0 bg-typography-900/40" />
      <UIActionsheet.Content
        className="rounded-t-lg px-5 shadow-floating"
        style={{
          paddingBottom: insets.bottom + 24,
          backgroundColor: '#FFFFFF',
          paddingHorizontal: 24,
        }}
      >
        {showHandle && (
          <UIActionsheet.DragIndicatorWrapper className="w-full items-center pb-2 pt-5">
            <UIActionsheet.DragIndicator className="h-1 w-9 rounded-full bg-outline-200" />
          </UIActionsheet.DragIndicatorWrapper>
        )}
        {children}
      </UIActionsheet.Content>
    </UIActionsheet>
  );
}
