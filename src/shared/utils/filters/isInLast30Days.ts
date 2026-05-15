export function isInLast30Days(date: Date): boolean {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return date >= thirtyDaysAgo && date <= now;
}
