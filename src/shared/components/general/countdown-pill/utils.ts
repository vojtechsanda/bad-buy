import { showSecondsThreshold } from './constants';

export function formatCountdown(expiresAt: string): string | null {
  const expiresAtInMilliseconds = new Date(expiresAt).getTime() - Date.now();

  if (expiresAtInMilliseconds <= 0) return null;

  const totalSeconds = Math.floor(expiresAtInMilliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  if (expiresAtInMilliseconds < showSecondsThreshold) {
    const minutes = totalMinutes;
    const seconds = totalSeconds % 60;

    if (minutes === 0) return `${seconds}s`;

    return `${minutes}m ${seconds}s`;
  }

  if (totalMinutes < 60) return `${totalMinutes}m`;

  if (totalHours < 24) return `${totalHours}h ${totalMinutes % 60}m`;

  return `${totalDays}d ${totalHours % 24}h`;
}
