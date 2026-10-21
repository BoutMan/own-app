import { describe, expect, it } from '@jest/globals';

import { displayLoad, inputLoadToKg } from '@/domain/units';

import { feltEasyTwice, isStalled, loadStepKg, suggestNext, type Line, type PastPerformance } from './plusOne';

const lb = (n: number) => inputLoadToKg(n, 'imperial');
const squat: Line = { name: 'Goblet squat', target: { kind: 'reps', min: 10, max: 12 }, rpe: { min: 7, max: 7 }, sets: 3 };
const plank: Line = { name: 'Plank', target: { kind: 'hold', minSeconds: 20, maxSeconds: 30 }, rpe: { min: 7, max: 7 }, sets: 3 };
const sets = (reps: number[], load: number, rpe?: number): PastPerformance => ({
  sets: reps.map((r) => ({ reps: r, loadKg: lb(load), rpe: rpe ?? null })),
});

describe('+1 rule (p. 38)', () => {
  it('asks to find a load the first time', () => {
    const s = suggestNext(squat, [], 'imperial');
    expect(s).toMatchObject({ kind: 'firstTime', loadKg: null, target: 10 });
  });

  it('asks for one more rep on the weakest set, as in the mockup', () => {
    const s = suggestNext(squat, [sets([11, 11, 11], 18)], 'imperial');
    expect(s.kind).toBe('addRep');
    expect(s.target).toBe(12);
    expect(s.title).toBe('One more rep on the goblet squat');
    expect(s.detail).toBe('Last time: 3 × 11 at 18 lb. Today, 12.');
  });

  it('never asks for more reps than the top of the range', () => {
    expect(suggestNext(squat, [sets([12, 12, 11], 18)], 'imperial').target).toBe(12);
  });

  it('adds load once the top of the range is reached on every set, cleanly', () => {
    const s = suggestNext(squat, [sets([12, 12, 12], 18, 7)], 'imperial');
    expect(s.kind).toBe('addLoad');
    expect(displayLoad(s.loadKg!, 'imperial')).toBe(22.5); // at least +1 kg (2.2 lb), next pickable weight above 20 lb
    expect(s.target).toBe(10);
  });

  it('does not add load when the top was reached with a grind (RPE above target)', () => {
    expect(suggestNext(squat, [sets([12, 12, 12], 18, 9)], 'imperial').kind).not.toBe('addLoad');
  });

  it('adds load when the exercise felt easy two sessions in a row', () => {
    const h = [sets([10, 10, 10], 18, 5), sets([10, 10, 10], 18, 5)];
    expect(feltEasyTwice(h, squat.rpe)).toBe(true);
    expect(suggestNext(squat, h, 'imperial').kind).toBe('addLoad');
  });

  it('keeps load steps within 1–2.5 kg', () => {
    for (const kg of [2, 4, 8, 9, 12, 20, 40]) {
      for (const u of ['imperial', 'metric'] as const) {
        const step = loadStepKg(kg, u);
        expect(step).toBeGreaterThanOrEqual(1);
        expect(step).toBeLessThanOrEqual(2.5);
      }
    }
  });

  it('suggests a harder version on bodyweight moves at the top of the range', () => {
    const bw: PastPerformance = { sets: [12, 12, 12].map((r) => ({ reps: r, rpe: 7 })) };
    expect(suggestNext(squat, [bw], 'imperial').kind).toBe('harder');
  });

  it('adds five seconds on holds, capped at the top', () => {
    const p: PastPerformance = { sets: [{ seconds: 22 }, { seconds: 20 }, { seconds: 27 }] };
    expect(suggestNext(plank, [p], 'imperial')).toMatchObject({ kind: 'addHold', target: 25 });
    const q: PastPerformance = { sets: [{ seconds: 28 }, { seconds: 29 }] };
    expect(suggestNext(plank, [q], 'imperial').target).toBe(30);
  });

  it('ignores deload sessions as a base for progress', () => {
    const deload = { ...sets([12, 12], 13), adjusted: true };
    const s = suggestNext(squat, [deload, sets([11, 11, 11], 18)], 'imperial');
    expect(s.detail).toContain('at 18 lb');
  });

  it('flags a stall after three sessions without progress', () => {
    const same = () => sets([11, 11, 10], 18);
    expect(isStalled([same(), same(), same()])).toBe(true);
    expect(isStalled([sets([11, 11, 11], 18), same(), same()])).toBe(false);
    expect(suggestNext(squat, [same(), same(), same()], 'imperial').stalled).toBe(true);
  });
});
