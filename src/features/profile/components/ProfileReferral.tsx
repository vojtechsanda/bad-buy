import { Button, ButtonText } from '@shared/components';
import { themeColor } from '@shared/constants';
import { Account } from '@shared/types';
import { Copy } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';

type ProfileReferralProps = {
  account: Account;
};

export function ProfileReferral({ account }: ProfileReferralProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // TODO: wire to expo-clipboard — `await Clipboard.setStringAsync(account.referral_code)`
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View className="gap-3 rounded-md bg-background-0 p-5 shadow shadow-black/10">
      <Text className="font-nunito-semibold text-caption uppercase tracking-widest text-typography-400">
        Your referral code
      </Text>

      <Text className="py-1 text-center font-nunito-bold text-display-md tracking-widest text-typography-900">
        {account.referral_code}
      </Text>

      <Button variant="outline" action="primary" size="md" onPress={handleCopy}>
        <Copy size={16} strokeWidth={1.75} color={themeColor.primary500} />
        <ButtonText className="font-nunito">{copied ? 'Copied!' : 'Copy code'} TODO</ButtonText>
      </Button>

      <Text className="text-center font-nunito text-body-sm text-typography-400">
        You and your friend each get 3 months of Premium when they redeem your code.
      </Text>
    </View>
  );
}
