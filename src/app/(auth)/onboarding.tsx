import { IdentityView, OnboardingShell } from '@features/onboarding';
import { useFocusEffect , router } from 'expo-router';

import { useCallback, useState } from 'react';
import { BackHandler } from 'react-native';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [totalSteps] = useState<3 | 4>(3);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (step > 1) setStep((s) => Math.max(1, s - 1));

        return true;
      });

      return () => sub.remove();
    }, [step]),
  );

  return (
    <OnboardingShell
      step={step}
      totalSteps={totalSteps}
      onBack={() => {
        if (step === 1) router.back();
        else setStep((s) => s - 1);
      }}
    >
      {step === 1 && (
        <IdentityView
          onComplete={() => {
            setStep(2);
          }}
        />
      )}
    </OnboardingShell>
  );
}
