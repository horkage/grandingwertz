export function getExpeditionRemainingTime(startedAt: string, duration: number): number {
  const started = new Date(startedAt).getTime();
  const now = Date.now();
  const end = started + duration * 1000; // duration is in seconds, convert to ms
  return Math.max(0, Math.floor((end - now) / 1000)); // remaining seconds, never negative
}