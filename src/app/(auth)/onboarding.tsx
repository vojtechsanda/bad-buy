import { IdentityFormData, IdentityView, OnboardingShell } from '@features/onboarding';
import { getCurrencyForCountry } from '@shared/utils';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [totalSteps] = useState<3 | 4>(3);
  const [identityData, setIdentityData] = useState<{
    data: IdentityFormData;
    currency: string;
  } | null>(null);

  useEffect(() => {
    if (step === 2 && identityData) console.log('step 2 ready', identityData);
  }, [step, identityData]);

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
          onComplete={(data) => {
            setIdentityData({ data, currency: getCurrencyForCountry(data.countryIso2) });
            setStep(2);
          }}
        />
      )}
    </OnboardingShell>
  );
}
