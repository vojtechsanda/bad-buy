import { GreetingView, PriceInput } from '@features/home';
import { ScreenContainer } from '@shared/components';
import { Button, ButtonText } from '@shared/components/ui';
import { TotalSavedCard, mockAccount, mockAccountHistory } from '@shared/modules/account';
import { CurrencyCode, CurrencySheet } from '@shared/modules/currency';
import { isInLast30Days } from '@shared/utils';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const account = mockAccount;

  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>(account.display_currency);
  const [currencySheetOpen, setCurrencySheetOpen] = useState(false);

  const isPriceValid = price.length > 0 && parseFloat(price) > 0;

  const handleSeeTheCost = () => {
    router.push(`/(app)/audit?price=${price}&currency=${currency}`);
    setPrice('');
  };

  const last30DaysHistory = mockAccountHistory.filter((item) =>
    isInLast30Days(new Date(item.created_at)),
  );

  return (
    <ScreenContainer>
      <View className="gap-8">
        <GreetingView name={account.name} />

        <TotalSavedCard
          history={last30DaysHistory}
          currency={account.display_currency}
          label="Saved in last 30 days"
        />

        <View className="gap-6">
          <PriceInput
            value={price}
            onValueChange={setPrice}
            currency={currency}
            onCurrencyTap={() => setCurrencySheetOpen(true)}
            autoFocus={true}
          />
          <Button
            variant="solid"
            action="primary"
            size="lg"
            isDisabled={!isPriceValid}
            onPress={handleSeeTheCost}
          >
            <ButtonText>See the cost</ButtonText>
          </Button>
        </View>
      </View>

      <CurrencySheet
        isOpen={currencySheetOpen}
        onClose={() => setCurrencySheetOpen(false)}
        selectedCurrency={currency}
        onSelect={(_currency) => {
          setCurrency(_currency);
          setCurrencySheetOpen(false);
        }}
      />
    </ScreenContainer>
  );
}
