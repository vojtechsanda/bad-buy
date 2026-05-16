import { BottomSheet, Button, ButtonText } from '@shared/components';
import { themeColor } from '@shared/constants';
import { useRouter } from 'expo-router';
import { Check, ShoppingBag, Snowflake } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export function AuditStickyFooter() {
  const router = useRouter();

  const [freezeSheetOpen, setFreezeSheetOpen] = useState(false);

  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <Button
          variant="outline"
          action="primary"
          size="lg"
          className="flex-1 bg-background-0"
          onPress={() => router.push('/(app)/buy')}
        >
          <ShoppingBag size={18} strokeWidth={1.75} color={themeColor.primary500} />
          <ButtonText>Buy</ButtonText>
        </Button>

        <Button
          variant="outline"
          action="primary"
          size="lg"
          className="flex-1 bg-background-0"
          onPress={() => setFreezeSheetOpen(true)}
        >
          <Snowflake size={18} strokeWidth={1.75} color={themeColor.primary500} />
          <ButtonText>Freeze</ButtonText>
        </Button>
      </View>

      <Pressable
        onPress={() => router.push('/(app)/skip')}
        className="h-14 flex-row items-center overflow-hidden rounded-2xl bg-primary-100 px-2"
      >
        <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-500">
          <Check size={18} strokeWidth={2.5} color="#FEFEFE" />
        </View>
        <Text className="flex-1 text-center font-nunito-semibold text-body text-primary-700">
          Tap to skip (PLACEHOLDER) →
        </Text>
      </Pressable>

      <BottomSheet isOpen={freezeSheetOpen} onClose={() => setFreezeSheetOpen(false)}>
        <Text className="font-nunito-bold text-heading text-typography-900">
          Freeze sheet — coming soon
        </Text>
        <Text className="mt-2 font-nunito text-body text-typography-600">
          Freeze functionality will be added in a later issue.
        </Text>
        <View className="mt-6">
          <Button
            variant="outline"
            action="primary"
            size="md"
            onPress={() => setFreezeSheetOpen(false)}
          >
            <ButtonText>Close</ButtonText>
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}
