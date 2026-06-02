import { Button, PremiumLockGate, SkeletonRowList } from '@shared/components';
import { themeColor } from '@shared/constants';
import { CurrencyCode, useConvertFromUsd } from '@shared/modules/currency';
import { useSuggestionsSWR } from '@shared/swr';
import { RefreshCw } from 'lucide-react-native';
import { Text, View } from 'react-native';

type SuggestionItem = {
  id: string;
  name: string;
  item_emoji: string | null;
  price_usd: number;
};

type AuditSuggestionListViewProps = {
  currency: CurrencyCode;
  priceUsd?: number;
  staticSuggestions?: SuggestionItem[];
};

export function AuditSuggestionListView({
  currency,
  priceUsd,
  staticSuggestions,
}: AuditSuggestionListViewProps) {
  const {
    suggestions: fetchedSuggestions,
    isLoading,
    error,
    retry,
    refresh,
  } = useSuggestionsSWR(priceUsd ?? null);
  const { convertAndFormatFromUsd } = useConvertFromUsd();

  const isLiveMode = staticSuggestions === undefined;
  const suggestions = staticSuggestions ?? fetchedSuggestions;

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-nunito-bold text-heading text-typography-900">
          What else this could buy
        </Text>
        {isLiveMode && (
          <PremiumLockGate>
            <Button
              variant="solid"
              action="neutral"
              size="sm"
              className="rounded-full"
              onPress={refresh}
              disabled={isLoading}
            >
              <RefreshCw size={18} strokeWidth={1.75} color={themeColor.typography900} />
            </Button>
          </PremiumLockGate>
        )}
      </View>

      {isLiveMode && isLoading && <SkeletonRowList />}

      {isLiveMode && error && (
        <View className="items-center gap-3 py-4">
          <Text className="font-nunito text-body text-typography-400">
            Couldn&apos;t load suggestions.
          </Text>
          <Button variant="outline" action="neutral" size="sm" onPress={retry}>
            <Text className="font-nunito-semibold text-body text-typography-900">Try again</Text>
          </Button>
        </View>
      )}

      {!isLoading && !error && suggestions.length === 0 && (
        <Text className="font-nunito text-body text-typography-400">No suggestions available.</Text>
      )}

      {!isLoading && !error && suggestions.length > 0 && (
        <View>
          {suggestions.map((suggestion, index) => (
            <View
              key={suggestion.id}
              className={`flex-row items-center justify-between gap-4 py-3 ${index > 0 ? 'border-t border-outline-100' : ''}`}
            >
              <View className="flex-1 flex-row items-center gap-3" style={{ minWidth: 0 }}>
                <Text className="text-3xl">{suggestion.item_emoji}</Text>
                <Text
                  className="flex-1 font-nunito-semibold text-lg text-typography-900"
                  numberOfLines={2}
                >
                  {suggestion.name}
                </Text>
              </View>

              <Text className="font-nunito text-body text-typography-400">
                {convertAndFormatFromUsd(suggestion.price_usd, currency)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
