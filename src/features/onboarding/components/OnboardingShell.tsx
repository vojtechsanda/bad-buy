import { BackButton, StepProgressBar } from '@shared/components';
import { ReactNode } from 'react';
import { View } from 'react-native';

type OnboardingShellProps = {
  children: (header: ReactNode) => ReactNode;
  step: number;
  totalSteps: number;
  onBack: () => void;
};

export function OnboardingShell({ children, step, totalSteps, onBack }: OnboardingShellProps) {
  const canGoBack = step > 1;

  const header = (
    <View className="flex-row items-center px-5 py-3">
      <View
        style={
          canGoBack ? { opacity: 1, width: 'auto', marginRight: 12 } : { opacity: 0, width: 0 }
        }
        pointerEvents={canGoBack ? 'auto' : 'none'}
      >
        <BackButton onPress={onBack} />
      </View>
      <StepProgressBar current={step} total={totalSteps} />
    </View>
  );

  return <>{children(header)}</>;
}
