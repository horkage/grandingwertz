export function getExpeditionRemainingTime(now: number, startedAt: string, duration: number): { remaining: number; progress: number } {
  const started = new Date(startedAt).getTime();
  const end = started + duration * 1000;
  const remaining = Math.max(0, Math.floor((end - now) / 1000));
  const progress = Math.min(1, Math.max(0, (now - started) / (end - started)));
  return { remaining, progress };
}