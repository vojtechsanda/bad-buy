import { accountService, hobbyService, useAccountSWR } from '@shared/modules/account';
import { auditService } from '@shared/modules/audit';
import {
  getRateFromExchangeRates,
  useConvertToUsd,
  useExchangeRates,
} from '@shared/modules/currency';
import { Alert } from 'react-native';

import { HobbyFormData, IdentityFormData, moneyFormData } from '../schemas';

type UseCreateAccountParams = {
  identityData: IdentityFormData | null;
  moneyData: moneyFormData | null;
  hobbyData: HobbyFormData | null;
};

export function useCreateAccountFn({ hobbyData, identityData, moneyData }: UseCreateAccountParams) {
  const { account, invalidateAccount } = useAccountSWR();
  const { convertToUsd } = useConvertToUsd();
  const { rates } = useExchangeRates();

  return async function createAccount() {
    if (!identityData || !moneyData || !hobbyData) return;

    const accountMethod = account ? accountService.update : accountService.create;

    try {
      const wageRateSnapshot = getRateFromExchangeRates(rates, moneyData.wageCurrency);

      const updatedAccount = await accountMethod({
        name: identityData.name,
        birthdate: identityData.birthdate.toISOString(),
        country: identityData.countryIso2,
        display_currency: moneyData.displayCurrency,
        wage_currency: moneyData.wageCurrency,
        hourly_wage_usd: convertToUsd(
          moneyData.hourlyWage,
          moneyData.wageCurrency,
          wageRateSnapshot,
        ),
        wage_rate_snapshot: wageRateSnapshot,
        work_hours_per_day: moneyData.workHoursPerDay,
      });

      await hobbyService.addMany(hobbyData.selectedIds);

      await invalidateAccount(updatedAccount, { revalidate: false });

      void auditService.triggerBackgroundSuggestionsRefresh();
    } catch (e) {
      console.error(JSON.stringify(e));

      Alert.alert('Error', "Couldn't create user account, please try again later.");
      invalidateAccount();
    }
  };
}
