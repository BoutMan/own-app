import type { CalendarSeries } from './plan';

// The web preview has no phone calendar.
export async function calendarAllowed(): Promise<boolean> {
  return false;
}

export async function askForCalendar(): Promise<boolean> {
  return false;
}

export async function clearCalendar(): Promise<void> {}

export async function syncCalendar(_series: readonly CalendarSeries[]): Promise<void> {}
