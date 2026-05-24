import {
  HobbyFormData,
  HobbyView,
  IdentityFormData,
  IdentityView,
  MoneyView,
  OnboardingShell,
  PromoView,
  buildCountryList,
  countryService,
  moneyFormData,
} from '@features/onboarding';
import { getCurrencyForCountry } from '@shared/modules/currency';
import { type CountryRow } from '@shared/types';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler } from 'react-native';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const totalSteps = step === 4 ? 4 : 3;

  const [countryRows, setCountryRows] = useState<CountryRow[]>([]);
  const displayCountries = useMemo(() => buildCountryList(countryRows), [countryRows]);

  const [identityData, setIdentityData] = useState<{
    data: IdentityFormData;
    currency: string;
  } | null>(null);
  const [moneyData, setMoneyData] = useState<moneyFormData | null>(null);
  const [hobbyData, setHobbyData] = useState<HobbyFormData | null>(null);

  useEffect(() => {
    countryService
      .listCountries()
      .then(setCountryRows)
      .catch((err) => {
        console.error('[onboarding] Failed to load countries:', err);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backhandlerSubscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (step > 1) setStep((s) => Math.max(1, s - 1));

        return true;
      });

      return () => backhandlerSubscription.remove();
    }, [step]),
  );

  function completeOnboarding() {
    console.log('onboarding complete', { identityData, moneyData, hobbyData });
    router.replace('/(app)/home');
  }

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
              defaultValues={identityData?.data}
              countries={displayCountries}
              onComplete={(data) => {
                setIdentityData({
                  data,
                  currency: getCurrencyForCountry(data.countryIso2, countryRows),
                });
                setStep(2);
              }}
            />
          )}
          {step === 2 && identityData && (
            <MoneyView
              screenHeader={header}
              defaultCurrency={identityData.currency}
              defaultValues={moneyData ?? undefined}
              onComplete={(data) => {
                setMoneyData(data);
                setStep(3);
              }}
            />
          )}
          {step === 3 && (
            <HobbyView
              screenHeader={header}
              defaultValues={hobbyData ?? undefined}
              onSelectionChange={(ids) => setHobbyData({ selectedIds: ids })}
              onPromoLinkTap={() => setStep(4)}
              onComplete={(data) => {
                setHobbyData(data);
                completeOnboarding();
              }}
            />
          )}
          {step === 4 && <PromoView screenHeader={header} onComplete={completeOnboarding} />}
        </>
      )}
    </OnboardingShell>
  );
}
