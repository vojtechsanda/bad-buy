import { accountService, useAccountSWR } from '@shared/modules/account';

import { HobbyFormData, IdentityFormData, moneyFormData } from '../schemas';

type UseCreateAccountParams = {
  identityData: IdentityFormData | null;
  moneyData: moneyFormData | null;
  hobbyData: HobbyFormData | null;
};

export function useCreateAccountFn({ hobbyData, identityData, moneyData }: UseCreateAccountParams) {
  const { account, invalidateAccount } = useAccountSWR();

  return async function createAccount() {
    if (!identityData || !moneyData || !hobbyData) return;

    const accountMethod = account ? accountService.update : accountService.create;

    await accountMethod({
      name: identityData.name,
      birthdate: identityData.birthdate.toISOString(),
      country: identityData.countryIso2,
      display_currency: moneyData.displayCurrency,
      wage_currency: moneyData.wageCurrency,
      hourly_wage_usd: moneyData.hourlyWage,
      work_hours_per_day: moneyData.workHoursPerDay,
    });

    // TODO(#177): uncomment once the service is adjusted
    // await hobbyService.addMany(hobbyData.selectedIds)

    invalidateAccount();
  };
}
