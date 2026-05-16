import { useEffect, useState } from 'react';
import { Text } from 'react-native';

import { refreshEverySecondThreshold } from './constants';
import { formatCountdown } from './utils';

type CountdownPillProps = {
  formatExpireAtLabel?: (expiresAtLabel: string) => string | null;
  expiresAt: string;
  expiredLabel: string;
  className?: string;
};

export function CountdownPill({
  formatExpireAtLabel = (label) => label,
  expiresAt,
  expiredLabel,
  className,
}: CountdownPillProps) {
  const [label, setLabel] = useState(() => formatCountdown(expiresAt));

  const getRemaining = (time: string) => new Date(time).getTime() - Date.now();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const refreshLabel = () => {
      setLabel(formatCountdown(expiresAt));

      const remaining = getRemaining(expiresAt);
      if (remaining <= 0) return;

      timeoutId = setTimeout(
        refreshLabel,
        remaining <= refreshEverySecondThreshold ? 1_000 : 60_000,
      );
    };

    refreshLabel();

    return () => clearTimeout(timeoutId);
  }, [expiresAt]);

  if (label === null || getRemaining(expiresAt) <= 0) {
    return (
      <Text className={`font-nunito-semibold text-caption text-error-500 ${className || ''}`}>
        {expiredLabel}
      </Text>
    );
  }

  return (
    <Text className={`font-nunito-semibold text-caption text-typography-600 ${className || ''}`}>
      {formatExpireAtLabel(label)}
    </Text>
  );
}
