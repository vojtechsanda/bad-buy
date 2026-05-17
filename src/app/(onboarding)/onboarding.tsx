import { getCurrencyForCountry } from '@features/currency/utils';
import {
  HobbyView,
  IdentityFormData,
  IdentityView,
  MoneyFormData,
  MoneyView,
  OnboardingShell,
  PromoView,
} from '@features/onboarding';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { BackHandler } from 'react-native';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [totalSteps] = useState<3 | 4>(3);
  const [identityData, setIdentityData] = useState<{
    data: IdentityFormData;
    currency: string;
  } | null>(null);
  const [moneyData, setMoneyData] = useState<MoneyFormData | null>(null);

  useFocusEffect(
    useCallback(() => {
      const backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (step > 1) setStep((s) => Math.max(1, s - 1));

        return true;
      });

      return () => backHandlerSubscription.remove();
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
      {(header) => (
        <>
          {step === 1 && (
            <IdentityView
              screenHeader={header}
              onComplete={(data) => {
                console.log('identity complete', data);
                setIdentityData({ data, currency: getCurrencyForCountry(data.countryIso2) });
                setStep(2);
              }}
            />
          )}
          {step === 2 && identityData && (
            <MoneyView
              screenHeader={header}
              defaultCurrency={identityData.currency}
              onComplete={(data) => {
                console.log('money complete', data);
                setMoneyData(data);
                setStep(3);
              }}
            />
          )}
          {step === 3 && (
            <HobbyView
              screenHeader={header}
              onComplete={() => {
                console.log('hobby complete');
                setStep(4);
              }}
            />
          )}
          {step === 4 && (
            <PromoView
              screenHeader={header}
              onComplete={() => {
                // TODO: submit to Supabase
                console.log('onboarding complete', { identityData, moneyData });
                router.replace('/(app)/home');
              }}
            />
          )}
        </>
      )}
    </OnboardingShell>
  );
}
