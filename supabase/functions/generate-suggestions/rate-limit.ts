export const FREE_LIMITS = { min: 10, hour: 30, day: 60, month: 100 } as const;
export const PREMIUM_HOUR_CAP = 30;

export type WindowName = 'min' | 'hour' | 'day' | 'month';
export type WindowKeys = Record<WindowName, string>;

export function getWindowKeys(now: Date): WindowKeys {
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = now.getUTCFullYear();
  const mo = pad(now.getUTCMonth() + 1);
  const d = pad(now.getUTCDate());
  const h = pad(now.getUTCHours());
  const m = pad(now.getUTCMinutes());
  return {
    min: `min:${y}-${mo}-${d}T${h}:${m}`,
    hour: `hour:${y}-${mo}-${d}T${h}`,
    day: `day:${y}-${mo}-${d}`,
    month: `month:${y}-${mo}`,
  };
}

export function secondsUntilNextWindow(now: Date, window: WindowName): number {
  const ms = now.getTime();
  if (window === 'min') return 60 - Math.floor((ms / 1000) % 60);
  if (window === 'hour') return 3600 - Math.floor((ms / 1000) % 3600);
  if (window === 'day') return 86400 - Math.floor((ms / 1000) % 86400);
  const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return Math.ceil((nextMonth.getTime() - ms) / 1000);
}

export function isOverPremiumCap(countMap: Map<string, number>, windows: WindowKeys): boolean {
  return (countMap.get(windows.hour) ?? 0) > PREMIUM_HOUR_CAP;
}

export function findExceededFreeWindow(
  countMap: Map<string, number>,
  windows: WindowKeys,
): WindowName | null {
  if ((countMap.get(windows.min) ?? 0) > FREE_LIMITS.min) return 'min';
  if ((countMap.get(windows.hour) ?? 0) > FREE_LIMITS.hour) return 'hour';
  if ((countMap.get(windows.day) ?? 0) > FREE_LIMITS.day) return 'day';
  if ((countMap.get(windows.month) ?? 0) > FREE_LIMITS.month) return 'month';
  return null;
}
