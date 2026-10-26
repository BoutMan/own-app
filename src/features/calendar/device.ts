import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

import type { CalendarSeries } from './plan';

const TITLE = 'Own';

export async function calendarAllowed(): Promise<boolean> {
  return (await Calendar.getCalendarPermissions()).granted;
}

export async function askForCalendar(): Promise<boolean> {
  const current = await Calendar.getCalendarPermissions();
  if (current.granted || !current.canAskAgain) return current.granted;
  return (await Calendar.requestCalendarPermissions()).granted;
}

/** Our own "Own" calendar, so resyncing never touches her other events. */
async function ownCalendars() {
  return (await Calendar.getCalendars(Calendar.EntityTypes.EVENT)).filter((c) => c.title === TITLE && c.allowsModifications);
}

/** Removes the "Own" calendar and every session in it. */
export async function clearCalendar(): Promise<void> {
  if (!(await calendarAllowed())) return;
  for (const c of await ownCalendars()) await c.delete();
}

/** Replaces the "Own" calendar with the planned series. */
export async function syncCalendar(series: readonly CalendarSeries[]): Promise<void> {
  if (!(await calendarAllowed())) return;
  await clearCalendar();
  if (series.length === 0) return;
  const source =
    Platform.OS === 'ios'
      ? Calendar.getDefaultCalendarSync().source
      : { isLocalAccount: true, name: TITLE, type: Calendar.SourceType.LOCAL };
  const cal = await Calendar.createCalendar({
    title: TITLE,
    color: '#8A6E5A',
    entityType: Calendar.EntityTypes.EVENT,
    ...(Platform.OS === 'ios' ? { sourceId: source.id } : { source, name: TITLE, ownerAccount: 'personal', accessLevel: Calendar.CalendarAccessLevel.OWNER }),
  });
  for (const s of series) {
    await cal.createEvent({
      title: s.title,
      startDate: s.start,
      endDate: s.end,
      recurrenceRule: { frequency: Calendar.Frequency.WEEKLY, endDate: s.until },
    });
  }
}
