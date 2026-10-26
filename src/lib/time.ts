/** Times of day as "18:30" (24 h, local), the way the profile stores them. */

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function fromMinutes(min: number): string {
  const m = ((min % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** "18:30" → "6:30 pm". */
export function formatTime(hhmm: string): string {
  const min = toMinutes(hhmm);
  const h = Math.floor(min / 60);
  return `${((h + 11) % 12) + 1}:${String(min % 60).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
}

/** Moves a time by `delta` minutes, kept between 5:00 am and 10:00 pm (sessions only). */
export function shiftSessionTime(hhmm: string, delta: number): string {
  return fromMinutes(Math.min(22 * 60, Math.max(5 * 60, toMinutes(hhmm) + delta)));
}
