import { StepProgressBar } from '@shared/components';
import { themeColor } from '@shared/constants';
import { ChevronLeft } from 'lucide-react-native';
import { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type OnboardingShellProps = {
  children: ReactNode;
  step: number;
  totalSteps: number;
  onBack: () => void;
};

export function OnboardingShell({ children, step, totalSteps, onBack }: OnboardingShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background-0" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-3 px-5 py-3">
        <Pressable onPress={onBack} hitSlop={8}>
          <ChevronLeft size={24} strokeWidth={1.75} color={themeColor.typography900} />
        </Pressable>

        <StepProgressBar current={step} total={totalSteps} />
      </View>
      {children}
    </View>
  );
}
