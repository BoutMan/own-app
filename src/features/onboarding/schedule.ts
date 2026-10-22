/** Weekly schedule picked in onboarding 6/7: three strength sessions (A/B/C) and an optional zone-2 walk. */

export type DayPlan = 'rest' | 'session' | 'walk';
/** Monday first. */
export type WeekPlan = readonly [DayPlan, DayPlan, DayPlan, DayPlan, DayPlan, DayPlan, DayPlan];

export const MAX_SESSIONS = 3;
export const SESSION_LETTERS = ['A', 'B', 'C'] as const;

export const defaultWeekPlan: WeekPlan = ['session', 'rest', 'session', 'rest', 'session', 'walk', 'rest'];

/**
 * Tapping a day cycles rest → session → walk → rest. A day skips "session" once three are
 * already planned, and there is at most one walk (picking a new one moves it).
 */
export function cycleDay(plan: WeekPlan, index: number): WeekPlan {
  const next = [...plan] as DayPlan[];
  const current = plan[index];
  const sessions = plan.filter((d) => d === 'session').length;
  if (current === 'rest') {
    next[index] = sessions < MAX_SESSIONS ? 'session' : 'walk';
  } else if (current === 'session') {
    next[index] = 'walk';
  } else {
    next[index] = 'rest';
  }
  if (next[index] === 'walk') {
    for (let i = 0; i < next.length; i++) if (i !== index && next[i] === 'walk') next[i] = 'rest';
  }
  return next as unknown as WeekPlan;
}

/** Session letter for each day (A, B, C in weekday order), or null. */
export function sessionLetters(plan: readonly DayPlan[]): (string | null)[] {
  let n = 0;
  return plan.map((d) => (d === 'session' ? (SESSION_LETTERS[n++] ?? null) : null));
}

export function countDates(plan: WeekPlan): number {
  return plan.filter((d) => d !== 'rest').length;
}
