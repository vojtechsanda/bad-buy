import { convertFromUsd } from '@features/currency/utils';
import { TrackedItem } from '@shared/types';

/**
 * Computes the total amount price of tracked items.
 *
 * It prevent double conversions by separating items that are already in the compute currency from those that are not and converting only the latter group.
 */
export function computeTotalItemsPrice(
  trackedItems: TrackedItem[],
  computeCurrency: string,
): number {
  const skippedInComputeCurrency = [];
  const skippedInOtherCurrency = [];

  for (const item of trackedItems) {
    if (item.price_currency === computeCurrency) {
      skippedInComputeCurrency.push(item);
    } else {
      skippedInOtherCurrency.push(item);
    }
  }

  const totalPriceInComputeCurrency = skippedInComputeCurrency.reduce(
    (total, item) => total + item.price_usd * item.conversion_rate_snapshot,
    0,
  );

  const totalPriceInOtherCurrency = skippedInOtherCurrency.reduce(
    (total, item) => total + convertFromUsd(item.price_usd, computeCurrency),
    0,
  );

  return totalPriceInComputeCurrency + totalPriceInOtherCurrency;
}
