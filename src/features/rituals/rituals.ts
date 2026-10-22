import type { IconName } from '@/components';
import type { RitualKind } from '@/db/repositories';
import type { Tone } from '@/theme';

/**
 * Today's rituals (spec, "Rituels"): one tap adds a step, a tap on a full gauge starts it again.
 * Steps come with Apple Health (V1). Water is counted in glasses (a quarter litre) in both units.
 */
export type Ritual = { kind: RitualKind; label: string; goal: number; step: number; icon: IconName; tone: Tone; detail: (v: number) => string; hint: string };

export const RITUALS: readonly Ritual[] = [
  { kind: 'morning', label: 'Morning flow', goal: 7, step: 7, icon: 'sun', tone: 'vanilla', detail: (v) => `${v} / 7 min`, hint: 'Marks the morning flow as done' },
  { kind: 'water', label: 'Water', goal: 2, step: 0.25, icon: 'water', tone: 'fog', detail: (v) => `${Math.round(v * 4)} / 8 glasses`, hint: 'Adds a glass of water' },
  { kind: 'protein', label: 'Protein', goal: 4, step: 1, icon: 'protein', tone: 'mauve', detail: (v) => `${v} / 4 palms`, hint: 'Adds a palm of protein' },
  { kind: 'evening', label: 'Evening wind-down', goal: 10, step: 10, icon: 'moon', tone: 'mocha', detail: (v) => `${v} / 10 min`, hint: 'Marks the evening wind-down as done' },
];

export function nextRitualValue(r: Ritual, value: number): number {
  return value >= r.goal ? 0 : Math.min(r.goal, value + r.step);
}

/** Share of today's rituals done, 0–100. */
export function ritualsPercent(values: Partial<Record<RitualKind, number>>): number {
  const parts = RITUALS.map((r) => Math.min(1, (values[r.kind] ?? 0) / r.goal));
  return Math.round((parts.reduce((a, b) => a + b, 0) / RITUALS.length) * 100);
}
