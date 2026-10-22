import { describe, expect, it } from '@jest/globals';

import { averageCycleLength, cyclePosition, phaseOf } from './cycle';

const d = (m: number, day: number) => new Date(2026, m - 1, day);

describe('cycle (guide p. 19)', () => {
  it('uses the guide phases on a 28-day cycle', () => {
    expect(phaseOf(1, 28)).toBe('period');
    expect(phaseOf(5, 28)).toBe('period');
    expect(phaseOf(9, 28)).toBe('follicular');
    expect(phaseOf(14, 28)).toBe('ovulation');
    expect(phaseOf(20, 28)).toBe('luteal');
  });

  it('moves ovulation with a longer cycle', () => {
    expect(phaseOf(14, 32)).toBe('follicular');
    expect(phaseOf(18, 32)).toBe('ovulation');
  });

  it('learns the average length, within 21–35 days', () => {
    expect(averageCycleLength([d(9, 1)])).toBe(28);
    expect(averageCycleLength([d(8, 1), d(8, 31), d(9, 30)])).toBe(30);
    expect(averageCycleLength([d(8, 1), d(9, 25)])).toBe(35); // 55 days, clamped
  });

  it('places today in the cycle', () => {
    const p = cyclePosition([d(10, 14)], d(10, 22));
    expect(p).toMatchObject({ day: 9, phase: 'follicular', length: 28 });
    expect(p!.nextPeriod.getDate()).toBe(11);
  });

  it('keeps counting through a missed log, then gives up after two cycles', () => {
    expect(cyclePosition([d(9, 1)], d(10, 3))!.day).toBe(5);
    expect(cyclePosition([d(7, 1)], d(10, 1))).toBeNull();
    expect(cyclePosition([], d(10, 1))).toBeNull();
  });
});
