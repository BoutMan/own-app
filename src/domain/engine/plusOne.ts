/**
 * The +1 rule (guide p. 38, spec "Le moteur de progression"): from what was done last time,
 * decide the one improvement to aim for today on an exercise.
 */
import { ceilLoad, displayLoad, formatLoad, inputLoadToKg, KG_PER_LB, type UnitSystem } from '@/domain/units';
import type { RepTarget, Rpe } from '@/domain/programme';

export type SetResult = {
  reps?: number | null;
  loadKg?: number | null;
  seconds?: number | null;
  rpe?: number | null;
};

/** One past session of this exercise, most recent first in a history array. */
export type PastPerformance = {
  sets: SetResult[];
  /** True when the loads were reduced on purpose (deload, test week, illness…): not a base for progress. */
  adjusted?: boolean;
};

export type Line = { name: string; target: RepTarget; rpe: Rpe; sets: number };

export type SuggestionKind = 'firstTime' | 'addLoad' | 'addRep' | 'addHold' | 'harder';

export type Suggestion = {
  kind: SuggestionKind;
  /** Load to use on every set, kg (null for bodyweight or when unknown). */
  loadKg: number | null;
  /** Reps (or seconds for holds) to aim for on every set. */
  target: number | null;
  title: string;
  detail: string;
  /** Three sessions without progress (p. 38): show the stall checklist. */
  stalled: boolean;
};

/** Next load up: at least 1 kg more (p. 38), landed on the next weight the user can actually pick. */
export function nextLoadKg(currentKg: number, units: UnitSystem): number {
  const now = displayLoad(currentKg, units);
  const minStep = units === 'metric' ? (now < 10 ? 1 : 2.5) : now < 25 ? 1 / KG_PER_LB : 5;
  return inputLoadToKg(ceilLoad(now + minStep, units), units);
}

/** Size of the next step up, kg. */
export function loadStepKg(currentKg: number, units: UnitSystem): number {
  return nextLoadKg(currentKg, units) - inputLoadToKg(displayLoad(currentKg, units), units);
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

function amount(s: SetResult): number {
  return s.reps ?? s.seconds ?? 0;
}

function topOf(target: RepTarget): number | null {
  if (target.kind === 'reps') return target.max;
  if (target.kind === 'hold') return target.maxSeconds;
  return null;
}

function bottomOf(target: RepTarget): number | null {
  if (target.kind === 'reps') return target.min;
  if (target.kind === 'hold') return target.minSeconds;
  return null;
}

function loadOf(p: PastPerformance): number {
  return Math.max(0, ...p.sets.map((s) => s.loadKg ?? 0));
}

/** Progress score: heavier first, then more total reps or seconds. */
function score(p: PastPerformance): [number, number] {
  return [loadOf(p), p.sets.reduce((n, s) => n + amount(s), 0)];
}

function beats(a: [number, number], b: [number, number]): boolean {
  return a[0] > b[0] || (a[0] === b[0] && a[1] > b[1]);
}

/** True when today's performance beats the previous one: heavier, or more reps/seconds at the same load. */
export function improvedOn(today: PastPerformance, previous: PastPerformance | undefined): boolean {
  if (!previous || previous.sets.length === 0) return false;
  return beats(score(today), score(previous));
}

/** p. 38: three sessions in a row without progress on the exercise. */
export function isStalled(history: PastPerformance[]): boolean {
  const base = history.filter((h) => !h.adjusted);
  if (base.length < 3) return false;
  const [s0, s1, s2] = base.slice(0, 3).map(score) as [[number, number], [number, number], [number, number]];
  return !beats(s0, s2) && !beats(s1, s2);
}

/** Spec: "exercise felt easy two sessions in a row" → suggest more load. Easy = every set at least 2 RPE under the target. */
export function feltEasyTwice(history: PastPerformance[], rpe: Rpe): boolean {
  const base = history.filter((h) => !h.adjusted).slice(0, 2);
  if (base.length < 2) return false;
  return base.every((h) => h.sets.length > 0 && h.sets.every((s) => s.rpe != null && s.rpe <= rpe.min - 2));
}

function describe(p: PastPerformance, target: RepTarget, units: UnitSystem): string {
  const unit = target.kind === 'hold' ? ' s' : '';
  const amounts = p.sets.map(amount);
  const same = amounts.every((a) => a === amounts[0]);
  const work = same ? `${p.sets.length} × ${amounts[0]}${unit}` : amounts.map((a) => `${a}${unit}`).join(', ');
  const load = loadOf(p);
  return load > 0 ? `${work} at ${formatLoad(load, units)}` : work;
}

export function suggestNext(line: Line, history: PastPerformance[], units: UnitSystem): Suggestion {
  const usable = history.filter((h) => !h.adjusted && h.sets.length > 0);
  const base = usable[0] ?? history.find((h) => h.sets.length > 0);
  const stalled = isStalled(history);
  const name = lower(line.name);

  if (!base) {
    const bottom = bottomOf(line.target);
    return {
      kind: 'firstTime',
      loadKg: null,
      target: bottom,
      title: `Find your load on the ${name}`,
      detail: `Pick a load that leaves about ${10 - line.rpe.max} reps in reserve at the end of each set. We'll remember it.`,
      stalled: false,
    };
  }

  const last = describe(base, line.target, units);
  const load = loadOf(base);
  const top = topOf(line.target);
  const topReached = top !== null && base.sets.length >= Math.min(line.sets, base.sets.length) && base.sets.every((s) => amount(s) >= top);
  const clean = base.sets.every((s) => s.rpe == null || s.rpe <= line.rpe.max);

  if (load > 0 && ((topReached && clean) || feltEasyTwice(history, line.rpe))) {
    const next = nextLoadKg(load, units);
    return {
      kind: 'addLoad',
      loadKg: next,
      target: bottomOf(line.target),
      title: `A heavier load on the ${name}`,
      detail: `Last time: ${last}. Today, ${formatLoad(next, units)}.`,
      stalled,
    };
  }

  if (topReached && clean) {
    return {
      kind: 'harder',
      loadKg: load > 0 ? load : null,
      target: top,
      title: `Make the ${name} harder`,
      detail: `Top of the range last time (${last}). Today: 3 seconds down on every rep, or the next level.`,
      stalled,
    };
  }

  const lowest = Math.min(...base.sets.map(amount));
  if (line.target.kind === 'hold') {
    const next = Math.min(lowest + 5, line.target.maxSeconds);
    return {
      kind: 'addHold',
      loadKg: load > 0 ? load : null,
      target: next,
      title: `Five more seconds on the ${name}`,
      detail: `Last time: ${last}. Today, ${next} s.`,
      stalled,
    };
  }
  const next = top === null ? lowest + 1 : Math.min(lowest + 1, top);
  return {
    kind: 'addRep',
    loadKg: load > 0 ? load : null,
    target: next,
    title: `One more rep on the ${name}`,
    detail: `Last time: ${last}. Today, ${next}.`,
    stalled,
  };
}
