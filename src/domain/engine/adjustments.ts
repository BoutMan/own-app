/**
 * Load adjustments: deloads and test week (p. 23, p. 34), missed weeks (p. 23, p. 55), illness,
 * period pain and soreness (p. 55, spec). Never "I cancel", always "I reduce".
 */
import { missedTraining, weekRule, type WeekNumber } from '@/domain/programme';
import { scaleLoadKg, type UnitSystem } from '@/domain/units';

export type AdjustmentReason = 'deload' | 'earlyDeload' | 'testWeek' | 'missedWeek' | 'restart' | 'illness' | 'period' | 'soreness';

export type Adjustment = { reason: AdjustmentReason; factor: number; title: string; message: string };

export function weekAdjustment(week: WeekNumber): Adjustment | null {
  const rule = weekRule(week);
  if (rule.phase === 'deload') {
    return {
      reason: 'deload',
      factor: rule.loadFactor ?? 0.7,
      title: 'Deload week',
      message:
        "2 sets, loads −30 %. Don't skip it: this is the week the last three turn into real progress. Without it you arrive at week 7 exhausted and stall.",
    };
  }
  if (rule.phase === 'test') {
    return {
      reason: 'testWeek',
      factor: rule.loadFactor ?? 0.8,
      title: 'Test week',
      message: 'Loads −20 % on the last three sessions, then the five tests from day 0. Then you celebrate.',
    };
  }
  return null;
}

export const caseAdjustments = {
  earlyDeload: {
    reason: 'earlyDeload',
    factor: 0.7,
    title: 'Deload week, a little early',
    message: '2 sets, loads −30 % until Sunday. Your body asked for it: next week you pick up where you were, fresher.',
  },
  missedWeek: {
    reason: 'missedWeek',
    factor: missedTraining.oneWeek.loadFactor,
    title: 'Welcome back',
    message: 'You pick up where you stopped, 10 % lighter for this first session. Nothing is late: the season just got a week longer.',
  },
  restart: {
    reason: 'restart',
    factor: missedTraining.twoWeeksOrMore.loadFactor,
    title: 'A fresh start of the block',
    message: 'We restart the block, 20 % lighter this week. Strength comes back much faster than it was built.',
  },
  illness: {
    reason: 'illness',
    factor: missedTraining.afterIllness.loadFactor,
    title: 'Lighter today',
    message: 'Loads at 70 %. Symptoms below the neck (fever, chesty cough, aches)? Rest instead, it counts too.',
  },
  period: {
    reason: 'period',
    factor: 0.8,
    title: 'Gentler today',
    message: 'Loads −20 % and the core work swapped for a walk. If you are not up to it, it is a rest day.',
  },
  soreness: {
    reason: 'soreness',
    factor: 0.8,
    title: 'Still sore?',
    message: 'Loads −20 % rather than skipping. Moving eases it.',
  },
} as const satisfies Record<string, Adjustment>;

/** Combined factor of several adjustments (they stack: a missed week inside a deload is lighter still). */
export function combinedFactor(adjustments: readonly Adjustment[]): number {
  return adjustments.reduce((f, a) => f * a.factor, 1);
}

/** Applies adjustments to a load and lands on a weight the user can actually pick. */
export function adjustLoadKg(loadKg: number, adjustments: readonly Adjustment[], units: UnitSystem): number {
  const f = combinedFactor(adjustments);
  return f === 1 ? loadKg : scaleLoadKg(loadKg, f, units);
}
