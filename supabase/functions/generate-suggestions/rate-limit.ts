/**
 * Rate-limit configuration and helpers for generate-suggestions.
 *
 * Semantics:
 *   Free users  — HARD caps: exceeded → 429 with Retry-After, no content returned.
 *   Premium users — SOFT caps: exceeded → serve stale cache, never 429.
 *
 * Counters are incremented only after a successful Gemini call, so the check
 * "count >= limit" correctly blocks the request that would push the count over.
 */

/** Hard caps for free users (all four windows must stay under their respective limits). */
export const FREE_LIMITS = { min: 10, hour: 30, day: 60, month: 100 } as const;

/**
 * Soft caps for premium users.
 * `min` acts as a burst guard so a single actor cannot exhaust the hour quota instantly.
 */
export const PREMIUM_LIMITS = { min: 5, hour: 30 } as const;

export type WindowName = 'min' | 'hour' | 'day' | 'month';

/**
 * Keys used as Redis-style counter identifiers in the rate-limit table.
 * Format examples:
 *   min   → "min:2026-05-30T21:47"
 *   hour  → "hour:2026-05-30T21"
 *   day   → "day:2026-05-30"
 *   month → "month:2026-05"
 */
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

/**
 * Returns the number of seconds until the start of the next window boundary.
 * All boundaries are derived from explicit UTC date component arithmetic rather
 * than epoch-modulo division, so they stay correct regardless of epoch offsets.
 */
export function secondsUntilNextWindow(now: Date, window: WindowName): number {
  const y = now.getUTCFullYear();
  const mo = now.getUTCMonth();
  const d = now.getUTCDate();
  const h = now.getUTCHours();
  const m = now.getUTCMinutes();

  let next: Date;
  if (window === 'min') {
    next = new Date(Date.UTC(y, mo, d, h, m + 1));
  } else if (window === 'hour') {
    next = new Date(Date.UTC(y, mo, d, h + 1));
  } else if (window === 'day') {
    next = new Date(Date.UTC(y, mo, d + 1));
  } else {
    next = new Date(Date.UTC(y, mo + 1, 1));
  }

  return Math.ceil((next.getTime() - now.getTime()) / 1000);
}

/**
 * Soft cap check for premium users.
 * Returns true if the per-minute burst guard or per-hour cap has been reached.
 * Callers should serve cached suggestions rather than returning 429.
 */
export function isOverPremiumCap(countMap: Map<string, number>, windows: WindowKeys): boolean {
  return (
    (countMap.get(windows.min) ?? 0) >= PREMIUM_LIMITS.min ||
    (countMap.get(windows.hour) ?? 0) >= PREMIUM_LIMITS.hour
  );
}

/**
 * Hard cap check for free users.
 * Returns the first exceeded window (checked tightest-to-loosest), or null if all are under limit.
 * Callers should return 429 with a Retry-After header derived from secondsUntilNextWindow.
 */
export function findExceededFreeWindow(
  countMap: Map<string, number>,
  windows: WindowKeys,
): WindowName | null {
  if ((countMap.get(windows.min) ?? 0) >= FREE_LIMITS.min) return 'min';
  if ((countMap.get(windows.hour) ?? 0) >= FREE_LIMITS.hour) return 'hour';
  if ((countMap.get(windows.day) ?? 0) >= FREE_LIMITS.day) return 'day';
  if ((countMap.get(windows.month) ?? 0) >= FREE_LIMITS.month) return 'month';
  return null;
}
