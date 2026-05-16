import { Text } from 'react-native';

type BadgeProps = {
  text: string;
  className?: string;
};

function Badge({ text, className }: BadgeProps) {
  return (
    <Text
      className={`rounded-full border px-2.5 py-1 font-nunito-bold text-caption uppercase tracking-wider ${className || ''}`}
    >
      {text}
    </Text>
  );
}

type PremiumStatusBadgeProps = {
  isPremium: boolean;
};

export function PremiumStatusBadge({ isPremium }: PremiumStatusBadgeProps) {
  if (isPremium) {
    return <Badge text="Premium" className="border-transparent bg-primary-500 text-typography-0" />;
  } else {
    return <Badge text="Free" className="border-outline-300 text-typography-400" />;
  }
}
