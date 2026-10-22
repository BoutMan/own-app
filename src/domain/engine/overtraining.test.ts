import { describe, expect, it } from '@jest/globals';

import { fatigueSigns, performanceDeclining, shouldOfferDeload } from './overtraining';
import type { PastPerformance } from './plusOne';

const perf = (reps: number): PastPerformance => ({ sets: [{ reps, loadKg: 8 }, { reps, loadKg: 8 }] });

describe('overtraining signs (spec)', () => {
  it('reads a drop of 2 points, or a score at 3 or under, as a sign', () => {
    expect(fatigueSigns([{ sleep: 5 }, { sleep: 7 }], [])).toEqual(['sleep']);
    expect(fatigueSigns([{ mood: 3 }], [])).toEqual(['irritability']);
    expect(fatigueSigns([{ energy: 6 }, { energy: 7 }], [])).toEqual([]);
  });

  it('detects performance falling three sessions in a row', () => {
    expect(performanceDeclining([perf(8), perf(9), perf(10), perf(11)])).toBe(true);
    expect(performanceDeclining([perf(8), perf(9), perf(9), perf(11)])).toBe(false);
    expect(performanceDeclining([perf(8), perf(9), perf(10)])).toBe(false);
  });

  it('ignores deload sessions when judging performance', () => {
    const deload = { ...perf(6), adjusted: true };
    expect(performanceDeclining([deload, perf(9), perf(10), perf(11), perf(12)])).toBe(true);
    expect(performanceDeclining([deload, perf(12), perf(11), perf(10), perf(9)])).toBe(false);
  });

  it('offers a deload from two signs', () => {
    const signs = fatigueSigns([{ sleep: 4, energy: 4 }, { sleep: 7, energy: 7 }], []);
    expect(signs).toEqual(['sleep', 'motivation']);
    expect(shouldOfferDeload(signs)).toBe(true);
    expect(shouldOfferDeload(['sleep'])).toBe(false);
    const withPerf = fatigueSigns([{ mood: 2 }], [[perf(8), perf(9), perf(10), perf(11)]]);
    expect(shouldOfferDeload(withPerf)).toBe(true);
  });
});
