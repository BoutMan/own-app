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

/** Feelings the user can log on the cycle screen (mockup 20). */
export const CYCLE_FEELINGS = [
  { id: 'energy', label: 'Full of energy' },
  { id: 'cramps', label: 'Cramps' },
  { id: 'bloated', label: 'Bloated' },
  { id: 'lowEnergy', label: 'Low energy' },
  { id: 'poorSleep', label: 'Poor sleep' },
  { id: 'hungry', label: 'Hungry' },
] as const;
export type CycleFeeling = (typeof CYCLE_FEELINGS)[number]['id'];

/** Groups of cycle days on the "Your own pattern" chart: the period, then 4-day steps. */
export const PATTERN_BUCKETS = [
  { label: 'Period', from: 1, to: 5 },
  { label: 'D6', from: 6, to: 9 },
  { label: 'D10', from: 10, to: 13 },
  { label: 'D14', from: 14, to: 17 },
  { label: 'D18', from: 18, to: 21 },
  { label: 'D22', from: 22, to: 25 },
  { label: 'D26', from: 26, to: 35 },
] as const;

/** Energy read from a day's feelings: 3 full of energy, 1 low energy, 2 otherwise (both: 2). */
function energyOf(feelings: readonly string[]): number {
  const high = feelings.includes('energy');
  const low = feelings.includes('lowEnergy');
  return high === low ? 2 : high ? 3 : 1;
}

export type EnergyPattern = {
  /** Complete cycles the pattern rests on. */
  cycles: number;
  /** Average energy per bucket (1–3), null where nothing was logged. */
  buckets: (number | null)[];
};

/**
 * The user's own energy by cycle day, from her daily logs (a lens, not a rule). Shown once two
 * full cycles are logged; days more than 35 days after a period start are left out.
 */
export function energyPattern(periodStarts: readonly Date[], logs: readonly { date: Date; feelings: readonly string[] }[]): EnergyPattern | null {
  const starts = [...periodStarts].sort((a, b) => a.getTime() - b.getTime());
  const cycles = starts.length - 1;
  if (cycles < 2) return null;
  const sums = PATTERN_BUCKETS.map(() => ({ total: 0, n: 0 }));
  for (const log of logs) {
    const start = [...starts].reverse().find((s) => daysBetween(s, log.date) >= 0);
    if (!start) continue;
    const day = daysBetween(start, log.date) + 1;
    const i = PATTERN_BUCKETS.findIndex((b) => day >= b.from && day <= b.to);
    if (i < 0) continue;
    sums[i]!.total += energyOf(log.feelings);
    sums[i]!.n++;
  }
  if (sums.every((s) => s.n === 0)) return null;
  return { cycles, buckets: sums.map((s) => (s.n ? s.total / s.n : null)) };
}

/** "This week we adjust" on the cycle screen: the guide's advice per phase (p. 19), as three lines. */
export const phaseAdjustments: Record<CyclePhase, readonly { title: string; text: string }[]> = {
  period: [
    { title: 'Lighter if you need it', text: 'Loads −20 %, core swapped for a walk. Or rest: it counts.' },
    { title: 'Walking and mobility', text: 'They help more than they cost this week' },
    { title: 'Protein steady', text: '4 palms a day, no change' },
  ],
  follicular: [
    { title: 'Heavier loads', text: 'Take the +1 on load when it feels easy' },
    { title: 'Your window for the hard things', text: 'New moves and tests sit well here' },
    { title: 'Protein steady', text: '4 palms a day, no change' },
  ],
  ovulation: [
    { title: 'Technique first', text: 'Mind your knees on squats, lunges and jumps' },
    { title: 'No improvised personal best', text: 'Enjoy the strength, keep the plan' },
    { title: 'Protein steady', text: '4 palms a day, no change' },
  ],
  luteal: [
    { title: '−10 to 20 % is fine', text: 'Same effort, lighter load: not a failure' },
    { title: 'Cut volume, not sessions', text: 'Fewer sets beats skipping the day' },
    { title: 'Sleep first', text: 'The evening wind-down earns its place this week' },
  ],
};
