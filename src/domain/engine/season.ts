/**
 * Where the user is in her season. The programme follows sessions, not the calendar (spec): a week
 * with no session at all does not count, so the season gets longer instead of "late".
 *  - one empty calendar week → resume the same programme week, −10 % on the first session (p. 23);
 *  - two or more empty weeks → restart at the beginning of the current block, −20 % that week (p. 55).
 */
import type { WeekNumber } from '@/domain/programme';

export type SeasonPosition = {
  week: WeekNumber;
  /** Calendar weeks since the season started (0 = first week). */
  calendarWeek: number;
  /** Weeks added by gaps. */
  extendedBy: number;
  /** Set when the user comes back after a gap. */
  resume: { kind: 'missedWeek' | 'restart'; firstSessionOnly: boolean } | null;
  /** All 12 weeks done. */
  finished: boolean;
};

const DAY = 86_400_000;

/** Monday 00:00 (local) of the week containing `d`. */
export function mondayOf(d: Date): Date {
  const m = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
  return m;
}

function weekIndex(start: Date, d: Date): number {
  return Math.floor((mondayOf(d).getTime() - mondayOf(start).getTime()) / (7 * DAY) + 0.01);
}

export function seasonPosition(start: Date, workoutDates: readonly Date[], today: Date): SeasonPosition {
  const current = Math.max(0, weekIndex(start, today));
  const counts = new Array<number>(current + 1).fill(0);
  for (const d of workoutDates) {
    const i = weekIndex(start, d);
    if (i >= 0 && i <= current) counts[i]!++;
  }

  let week = 1;
  let gap = 0;
  let extendedBy = 0;
  let resume: SeasonPosition['resume'] = null;
  for (let c = 0; c < current; c++) {
    if (counts[c]! > 0) {
      if (gap >= 2) week = Math.floor((week - 1) / 4) * 4 + 1; // restarted the block that week
      week++;
      gap = 0;
    } else {
      gap++;
      extendedBy++;
    }
  }
  if (gap === 1) resume = { kind: 'missedWeek', firstSessionOnly: true };
  if (gap >= 2) {
    week = Math.floor((week - 1) / 4) * 4 + 1;
    resume = { kind: 'restart', firstSessionOnly: false };
  }
  // The −10 % only applies to the first session back.
  if (resume?.firstSessionOnly && counts[current]! > 0) resume = null;

  return { week: Math.min(week, 12) as WeekNumber, calendarWeek: current, extendedBy, resume, finished: week > 12 };
}
