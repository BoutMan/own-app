/**
 * Units. Loads are stored in kg and lengths in cm (CLAUDE.md, rule 5); the US default is imperial.
 * Display rounding follows what women actually find in a gym: lb dumbbells step by 1 lb at the light
 * end and 2.5 lb above 20 lb; kg loads step by 0.5 kg.
 */

export type UnitSystem = 'imperial' | 'metric';

export const KG_PER_LB = 0.45359237;
export const CM_PER_IN = 2.54;

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

/** Rounds a load, in the display unit, to the nearest step a user can actually pick. */
export function roundLoad(value: number, system: UnitSystem): number {
  if (system === 'metric') return roundTo(value, 0.5);
  return value <= 20 ? roundTo(value, 1) : roundTo(value, 2.5);
}

/** Smallest pickable load at or above `value` (display unit). */
export function ceilLoad(value: number, system: UnitSystem): number {
  const eps = 1e-6;
  if (system === 'metric') return Math.ceil(value / 0.5 - eps) * 0.5;
  return value <= 20 ? Math.ceil(value - eps) : Math.ceil(value / 2.5 - eps) * 2.5;
}

/** Next (dir = 1) or previous (dir = −1) pickable load, in kg. Never below 0 (bodyweight). */
export function stepLoadKg(kg: number, dir: 1 | -1, system: UnitSystem): number {
  const now = displayLoad(kg, system);
  let next: number;
  if (system === 'metric') next = now + dir * (now + (dir > 0 ? 0 : -0.01) < 10 ? 1 : 2.5);
  else next = now + dir * (now + (dir > 0 ? 0 : -0.01) < 20 ? 1 : 2.5);
  next = roundLoad(Math.max(0, next), system);
  return inputLoadToKg(next, system);
}

/** Load in the display unit, rounded for display ("18 lb" for 8 kg). */
export function displayLoad(kg: number, system: UnitSystem): number {
  return roundLoad(system === 'metric' ? kg : kgToLb(kg), system);
}

/** "18 lb" · "8 kg" · "8.5 kg" */
export function formatLoad(kg: number, system: UnitSystem): string {
  const v = displayLoad(kg, system);
  const text = Number.isInteger(v) ? String(v) : v.toFixed(1);
  return `${text} ${system === 'metric' ? 'kg' : 'lb'}`;
}

/** Load typed by the user in her unit, back to kg for storage. */
export function inputLoadToKg(value: number, system: UnitSystem): number {
  return system === 'metric' ? value : lbToKg(value);
}

/** Applies a percentage change (e.g. −30 % on a deload) and rounds to a pickable load, in kg. */
export function scaleLoadKg(kg: number, factor: number, system: UnitSystem): number {
  const scaled = displayLoad(kg * factor, system);
  return inputLoadToKg(scaled, system);
}

/** "5 ft 6 in" · "168 cm" */
export function formatLength(cm: number, system: UnitSystem): string {
  if (system === 'metric') return `${Math.round(cm)} cm`;
  const totalIn = Math.round(cm / CM_PER_IN);
  const ft = Math.floor(totalIn / 12);
  const inches = totalIn % 12;
  return ft > 0 ? `${ft} ft ${inches} in` : `${inches} in`;
}

/** Waist, hips, thigh: inches with one decimal in imperial. */
export function formatGirth(cm: number, system: UnitSystem): string {
  return system === 'metric' ? `${roundTo(cm, 0.5)} cm` : `${(cm / CM_PER_IN).toFixed(1)} in`;
}
