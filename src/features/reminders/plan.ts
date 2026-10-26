/**
 * Local reminders (CLAUDE.md: expo-notifications, scheduled on the phone, nothing sent anywhere).
 * Pure planning: which weekly notifications the profile asks for. Tone: a friend who knows,
 * never guilt (spec, "Lasting 90 days").
 */
import { sessionLetters, type DayPlan } from '@/features/onboarding/schedule';
import { formatTime, toMinutes } from '@/lib/time';

export type ReminderSettings = {
  weekPlan: readonly DayPlan[];
  sessionTime: string;
  remindSession: boolean;
  remindNightBefore: boolean;
  remindSunday: boolean;
  remindEvening: boolean;
};

export type PlannedReminder = {
  id: string;
  /** 0 = Monday … 6 = Sunday. */
  day: number;
  hour: number;
  minute: number;
  title: string;
  body: string;
};

const NIGHT_BEFORE = 21 * 60;
const SUNDAY_CHECK_IN = 18 * 60;
const WIND_DOWN = 21 * 60 + 30;

/** Minutes since Monday 00:00 → day and time, wrapping around the week. */
function at(minuteOfWeek: number) {
  const m = ((minuteOfWeek % 10080) + 10080) % 10080;
  return { day: Math.floor(m / 1440), hour: Math.floor((m % 1440) / 60), minute: m % 60 };
}

export function planReminders(s: ReminderSettings): PlannedReminder[] {
  const out: PlannedReminder[] = [];
  const letters = sessionLetters(s.weekPlan);
  const time = toMinutes(s.sessionTime);
  letters.forEach((letter, day) => {
    if (!letter) return;
    if (s.remindSession) {
      out.push({
        id: `session-${day}`,
        ...at(day * 1440 + time - 30),
        title: `Session ${letter} at ${formatTime(s.sessionTime)}`,
        body: 'Thirty minutes to go. Even the 10-minute version counts.',
      });
    }
    if (s.remindNightBefore) {
      out.push({
        id: `night-${day}`,
        ...at((day - 1) * 1440 + NIGHT_BEFORE),
        title: 'Tomorrow is a session day',
        body: 'Lay out your clothes tonight. Future you says thanks.',
      });
    }
  });
  if (s.remindSunday) {
    out.push({ id: 'sunday', ...at(6 * 1440 + SUNDAY_CHECK_IN), title: 'Your Sunday check-in', body: 'Two minutes: look back on the week, plan the next one.' });
  }
  if (s.remindEvening) {
    for (let day = 0; day < 7; day++) {
      out.push({ id: `evening-${day}`, ...at(day * 1440 + WIND_DOWN), title: 'Evening wind-down', body: 'Screens down, ten slow minutes. Sleep is part of the programme.' });
    }
  }
  return out;
}
