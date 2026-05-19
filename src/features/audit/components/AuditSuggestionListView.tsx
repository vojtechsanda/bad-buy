import { CurrencyCode } from '@features/currency/types';
import { convertAndFormatFromUsd } from '@features/currency/utils';
import { Button, PremiumLockGate } from '@shared/components';
import { themeColor } from '@shared/constants';
import { AccountSuggestion } from '@shared/types';
import { RefreshCw } from 'lucide-react-native';
import { ActivityIndicator, Text, View } from 'react-native';

type AuditSuggestionListViewProps = {
  currency: CurrencyCode;
  suggestions: AccountSuggestion[];
  isLoading?: boolean;
  onRefresh?: () => void;
  showRefresh?: boolean;
};

export function AuditSuggestionListView({
  currency,
  suggestions,
  isLoading = false,
  onRefresh,
  showRefresh = true,
}: AuditSuggestionListViewProps) {
  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-nunito-bold text-heading text-typography-900">
          What else this could buy
        </Text>
        {showRefresh && onRefresh && (
          <PremiumLockGate>
            <Button
              variant="solid"
              action="neutral"
              size="md"
              className="rounded-full"
              onPress={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw size={18} strokeWidth={1.75} color={themeColor.typography900} />
            </Button>
          </PremiumLockGate>
        )}
      </View>

      {isLoading && suggestions.length === 0 ? (
        <ActivityIndicator />
      ) : (
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
