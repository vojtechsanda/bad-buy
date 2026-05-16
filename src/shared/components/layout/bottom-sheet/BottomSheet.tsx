import { UIActionsheet } from '@shared/components/ui/actionsheet';
import { BlurView } from 'expo-blur';
import { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useScreenContainerBlurRefContext } from '../screen-container';

export type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  /** 0..1 — fraction of screen height, 'auto' — height based on content */
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

  const blurRef = useScreenContainerBlurRefContext();

  return (
    <UIActionsheet isOpen={isOpen} onClose={onClose} snapPoints={snapPoints} useRNModal>
      <BlurView blurTarget={blurRef} intensity={10} blurMethod="dimezisBlurViewSdk31Plus">
        <UIActionsheet.Backdrop className="absolute inset-0 bg-typography-900/40" />
        <UIActionsheet.Content
          className="rounded-t-lg bg-background-0 px-5 shadow-floating"
          style={{ paddingBottom: insets.bottom + 24 }}
        >
          {showHandle && (
            <UIActionsheet.DragIndicatorWrapper className="w-full items-center pb-2 pt-5">
              <UIActionsheet.DragIndicator className="h-1 w-9 rounded-full bg-outline-200" />
            </UIActionsheet.DragIndicatorWrapper>
          )}
          {children}
        </UIActionsheet.Content>
      </BlurView>
    </UIActionsheet>
  );
}
