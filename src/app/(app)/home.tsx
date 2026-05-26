import { GreetingView, PriceInput } from '@features/home';
import { FullSizeError, FullSizeSpinner, ScreenContainer } from '@shared/components';
import { Button, ButtonText } from '@shared/components/ui';
import { TotalSavedCard, useAccountSWR } from '@shared/modules/account';
import { CurrencyCode, CurrencySheet } from '@shared/modules/currency';
import { useTrackedItemsSWR } from '@shared/swr';
import { isInLast30Days } from '@shared/utils';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const { account, isLoading } = useAccountSWR();
  const { trackedItems, isLoading: isTrackedItemsLoading } = useTrackedItemsSWR();

  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode | null>(null);
  const [currencySheetOpen, setCurrencySheetOpen] = useState(false);

  if (isLoading || isTrackedItemsLoading) return <FullSizeSpinner />;
  if (!account) return <FullSizeError message="Unable to load profile, please try again later" />;
  if (!trackedItems) {
    return <FullSizeError message="Unable to load history, please try again later" />;
  }

  const isPriceValid = price.length > 0 && parseFloat(price) > 0;

  const handleSeeTheCost = () => {
    router.push(`/(app)/audit?price=${price}&currency=${currency}`);
    setPrice('');
  };

  const last30DaysHistory = trackedItems.filter((item) =>
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
            currency={currency ?? account.display_currency}
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
        selectedCurrency={currency ?? account.display_currency}
        onSelect={(_currency) => {
          setCurrency(_currency);
          setCurrencySheetOpen(false);
        }}
      />
    </ScreenContainer>
  );
}
