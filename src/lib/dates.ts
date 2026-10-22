/** Calendar helpers. All functions are pure and work in the device's local time zone. */

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export const SEASON_WEEKS = 12;

export function addDays(date: Date, days: number): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() + days);
  return d;
}

/** The Monday strictly after `from` (a season always starts on the next Monday). */
export function nextMonday(from: Date): Date {
  const daysUntil = ((8 - from.getDay()) % 7) || 7;
  return addDays(from, daysUntil);
}

/** Last day (Sunday) of a season starting on `start`. */
export function seasonEnd(start: Date): Date {
  return addDays(start, SEASON_WEEKS * 7 - 1);
}

/** "Oct 27" */
export function formatShort(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

/** "Monday, Oct 27" */
export function formatLong(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${formatShort(date)}`;
}

/** Local calendar date as "2026-10-27". */
export function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
