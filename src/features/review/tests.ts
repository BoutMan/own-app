import type { TestUnit } from '@/domain/programme';

/** Push-up hand height (guide p. 14: "note the height too"), easiest first. */
export const PUSH_UP_HEIGHTS = [
  { id: 'wall', label: 'Wall' },
  { id: 'table', label: 'Table edge' },
  { id: 'knees', label: 'Knees' },
  { id: 'floor', label: 'Floor' },
] as const;
export type PushUpHeight = (typeof PUSH_UP_HEIGHTS)[number]['id'];

export function stepFor(unit: TestUnit): number {
  return unit === 'seconds' ? 5 : 1;
}

export function formatTestValue(v: number, unit: TestUnit): string {
  return unit === 'reps' ? `${v} reps` : unit === 'seconds' ? `${v} s` : `${v} min`;
}

/** Gain since day 0, signed: "+4", "+23 s", "−1 min". */
export function formatDelta(delta: number, unit: TestUnit): string {
  const sign = delta > 0 ? '+' : delta < 0 ? '−' : '±';
  const abs = Math.abs(delta);
  return unit === 'reps' ? `${sign}${abs}` : unit === 'seconds' ? `${sign}${abs} s` : `${sign}${abs} min`;
}
