/**
 * "Add to my calendar" (spec, onboarding 6/7): one weekly series per session day, from the season's
 * first week to its last. Titles stay neutral: a calendar may sync elsewhere, so no health or
 * training detail goes in it.
 */
import { sessionLetters, type DayPlan } from '@/features/onboarding/schedule';
import { toMinutes } from '@/lib/time';

export type CalendarSeries = { title: string; start: Date; end: Date; until: Date };

export const SESSION_MINUTES = 45;

export function planCalendar(weekPlan: readonly DayPlan[], sessionTime: string, seasonStart: Date, weeks = 12): CalendarSeries[] {
  const monday = new Date(seasonStart.getFullYear(), seasonStart.getMonth(), seasonStart.getDate() - ((seasonStart.getDay() + 6) % 7));
  const until = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + weeks * 7 - 1, 23, 59);
  const minutes = toMinutes(sessionTime);
  return sessionLetters(weekPlan).flatMap((letter, day) => {
    if (!letter) return [];
    const start = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + day, Math.floor(minutes / 60), minutes % 60);
    return [{ title: `Own · Session ${letter}`, start, end: new Date(start.getTime() + SESSION_MINUTES * 60_000), until }];
  });
}
