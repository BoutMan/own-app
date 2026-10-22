/**
 * Overtraining (spec, "Le moteur de progression"): two signs among degraded sleep, irritability,
 * falling motivation, performance down over 3 sessions, rising resting heart rate → offer a deload
 * now. Without Apple Health (V1), the app reads the signs it can measure: the Sunday check-ins
 * (sleep, mood for irritability, energy for motivation) and the logged sets.
 */
import type { PastPerformance } from './plusOne';

export type CheckInScores = { sleep?: number | null; mood?: number | null; energy?: number | null };

export type FatigueSign = 'sleep' | 'irritability' | 'motivation' | 'performance' | 'restingHeartRate';

export const fatigueSignLabels: Record<FatigueSign, string> = {
  sleep: 'Sleep getting worse',
  irritability: 'More irritable',
  motivation: 'Motivation dropping',
  performance: 'Performance down 3 sessions in a row',
  restingHeartRate: 'Resting heart rate up',
};

/** A score dropped by 2 points or more since the previous check-in, or sits at 3/10 or under. */
function worse(now: number | null | undefined, before: number | null | undefined): boolean {
  if (now == null) return false;
  if (now <= 3) return true;
  return before != null && before - now >= 2;
}

function total(p: PastPerformance): number {
  return p.sets.reduce((n, s) => n + (s.reps ?? s.seconds ?? 0) * Math.max(1, s.loadKg ?? 1), 0);
}

/** Performance down on three sessions in a row of the same exercise (each worse than the one before). */
export function performanceDeclining(history: PastPerformance[]): boolean {
  const base = history.filter((h) => !h.adjusted && h.sets.length > 0).slice(0, 4);
  if (base.length < 4) return false;
  const [a, b, c, d] = base.map(total) as [number, number, number, number];
  return a < b && b < c && c < d;
}

/**
 * Signs present this week. `checkIns` is most recent first; `histories` holds the recent history
 * of each main exercise. Performance counts once if any main exercise is declining.
 */
export function fatigueSigns(checkIns: readonly CheckInScores[], histories: readonly PastPerformance[][]): FatigueSign[] {
  const signs: FatigueSign[] = [];
  const [now, before] = checkIns;
  if (now) {
    if (worse(now.sleep, before?.sleep)) signs.push('sleep');
    if (worse(now.mood, before?.mood)) signs.push('irritability');
    if (worse(now.energy, before?.energy)) signs.push('motivation');
  }
  if (histories.some(performanceDeclining)) signs.push('performance');
  return signs;
}

/** Spec: two signs → offer an immediate deload. */
export function shouldOfferDeload(signs: readonly FatigueSign[]): boolean {
  return signs.length >= 2;
}
