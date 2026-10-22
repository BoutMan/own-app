/**
 * The cycle as a compass, guide p. 19: a lens, not a rule. The programme stays on its weeks;
 * the phase only adds advice. Phase days follow the guide (1–5, 6–13, around 14, 15–28), scaled to
 * the user's own average cycle length once she has logged a few periods.
 */

export type CyclePhase = 'period' | 'follicular' | 'ovulation' | 'luteal';

export type CyclePosition = {
  /** Day of the current cycle, 1-based. */
  day: number;
  phase: CyclePhase;
  /** Average length used, days. */
  length: number;
  /** Expected first day of the next period. */
  nextPeriod: Date;
};

const DAY = 86_400_000;
const DEFAULT_LENGTH = 28;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const daysBetween = (a: Date, b: Date) => Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY);

/** Average of the last cycles (up to 6), kept within 21–35 days; 28 until two periods are logged. */
export function averageCycleLength(periodStarts: readonly Date[]): number {
  const sorted = [...periodStarts].sort((a, b) => a.getTime() - b.getTime());
  const lengths: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const l = daysBetween(sorted[i - 1]!, sorted[i]!);
    if (l >= 15 && l <= 60) lengths.push(l);
  }
  const recent = lengths.slice(-6);
  if (recent.length === 0) return DEFAULT_LENGTH;
  const avg = Math.round(recent.reduce((a, b) => a + b, 0) / recent.length);
  return Math.min(35, Math.max(21, avg));
}

export function phaseOf(day: number, length: number): CyclePhase {
  if (day <= 5) return 'period';
  // Ovulation sits about 14 days before the next period.
  const ovulation = length - 14;
  if (Math.abs(day - ovulation) <= 1) return 'ovulation';
  return day < ovulation ? 'follicular' : 'luteal';
}

/** Null when no period is logged, or the last one is too old to say anything (> 2 cycles). */
export function cyclePosition(periodStarts: readonly Date[], today: Date): CyclePosition | null {
  if (periodStarts.length === 0) return null;
  const last = [...periodStarts].sort((a, b) => b.getTime() - a.getTime())[0]!;
  const length = averageCycleLength(periodStarts);
  const since = daysBetween(last, today);
  if (since < 0 || since >= length * 2) return null;
  const day = (since % length) + 1;
  const nextPeriod = new Date(last.getFullYear(), last.getMonth(), last.getDate() + (Math.floor(since / length) + 1) * length);
  return { day, phase: phaseOf(day, length), length, nextPeriod };
}

/** The guide's advice per phase (p. 19), short enough for a pill and a card. */
export const phaseAdvice: Record<CyclePhase, { label: string; pill: string; advice: string }> = {
  period: {
    label: 'Period',
    pill: 'Period · gentle is fine',
    advice: 'Energy often low, and the fatigue is real. Walking, mobility, lighter strength if you feel like it. Rest without guilt.',
  },
  follicular: {
    label: 'Follicular',
    pill: 'Follicular · good day for heavy',
    advice: 'Energy, mood and recovery at their best of the month. Your window: heavy loads, new exercises, tests.',
  },
  ovulation: {
    label: 'Ovulation',
    pill: 'Ovulation · mind your knees',
    advice: 'Peak strength, but looser ligaments. Enjoy it, and mind your technique on squats, lunges and jumps. No improvised personal bests.',
  },
  luteal: {
    label: 'Luteal',
    pill: 'Luteal · −10 to 20 % is fine',
    advice: 'Effort feels harder at the same load. Keep the rhythm, cut the volume rather than skipping: 10 to 20 % lighter does not count as a failure.',
  },
};
