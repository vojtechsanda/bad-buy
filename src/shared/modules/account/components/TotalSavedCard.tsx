import { StatisticsCard } from '@shared/components';
import { CurrencyCode } from '@shared/modules/currency';
import { TrackedItem } from '@shared/types';
import { formatPrice } from '@shared/utils';

import { computeTotalItemsPrice } from '../utils';

type TotalSavedCardProps = {
  history: TrackedItem[];
  currency: CurrencyCode;
  label: string;
};

export function TotalSavedCard({ history, currency, label }: TotalSavedCardProps) {
  const skippedItems = history.filter((item) => item.status === 'skipped');
  const total = computeTotalItemsPrice(skippedItems, currency);

  return <StatisticsCard caption={label} value={formatPrice(total, currency)} />;
}
