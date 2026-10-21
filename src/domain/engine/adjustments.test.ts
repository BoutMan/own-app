import { describe, expect, it } from '@jest/globals';

import { displayLoad, inputLoadToKg } from '@/domain/units';

import { adjustLoadKg, caseAdjustments, combinedFactor, weekAdjustment } from './adjustments';

const lb = (n: number) => inputLoadToKg(n, 'imperial');

describe('load adjustments', () => {
  it('deloads weeks 4 and 8 by 30 % and test week by 20 %', () => {
    expect(weekAdjustment(4)).toMatchObject({ reason: 'deload', factor: 0.7 });
    expect(weekAdjustment(8)).toMatchObject({ reason: 'deload', factor: 0.7 });
    expect(weekAdjustment(12)).toMatchObject({ reason: 'testWeek', factor: 0.8 });
    expect(weekAdjustment(3)).toBeNull();
  });

  it('explains why not to skip the deload', () => {
    expect(weekAdjustment(4)!.message).toContain("Don't skip it");
  });

  it('lands adjusted loads on weights you can pick', () => {
    expect(displayLoad(adjustLoadKg(lb(18), [weekAdjustment(4)!], 'imperial'), 'imperial')).toBe(13);
    expect(displayLoad(adjustLoadKg(lb(45), [caseAdjustments.period], 'imperial'), 'imperial')).toBe(35);
    expect(adjustLoadKg(10, [caseAdjustments.illness], 'metric')).toBe(7);
  });

  it('stacks adjustments', () => {
    expect(combinedFactor([weekAdjustment(4)!, caseAdjustments.missedWeek])).toBeCloseTo(0.63);
    expect(adjustLoadKg(10, [], 'metric')).toBe(10);
  });

  it('never talks about cancelling', () => {
    for (const a of Object.values(caseAdjustments)) expect(a.message.toLowerCase()).not.toContain('cancel');
  });
});
