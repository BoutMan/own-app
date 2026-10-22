import { describe, expect, it } from '@jest/globals';

import { mondayOf, seasonPosition } from './season';

const start = new Date(2026, 9, 26); // Monday, Oct 26 2026
const day = (offset: number) => new Date(2026, 9, 26 + offset, 18, 30);
/** Three sessions (Mon, Wed, Fri) in each listed calendar week. */
const weeks = (...idx: number[]) => idx.flatMap((w) => [day(w * 7), day(w * 7 + 2), day(w * 7 + 4)]);

describe('season position', () => {
  it('finds the Monday of a week', () => {
    expect(mondayOf(new Date(2026, 9, 29)).getDate()).toBe(26);
    expect(mondayOf(new Date(2026, 10, 1)).getDate()).toBe(26); // Sunday
  });

  it('starts in week 1', () => {
    expect(seasonPosition(start, [], day(0))).toMatchObject({ week: 1, resume: null, extendedBy: 0 });
  });

  it('moves one programme week per calendar week with sessions', () => {
    expect(seasonPosition(start, weeks(0, 1), day(14)).week).toBe(3);
  });

  it('resumes the same week after one empty week, −10 % on the first session only', () => {
    const p = seasonPosition(start, weeks(0, 1), day(21));
    expect(p).toMatchObject({ week: 3, extendedBy: 1, resume: { kind: 'missedWeek', firstSessionOnly: true } });
    const after = seasonPosition(start, [...weeks(0, 1), day(21)], day(23));
    expect(after.resume).toBeNull();
    expect(after.week).toBe(3);
  });

  it('restarts the current block after two empty weeks', () => {
    // Weeks 1–6 done, then two weeks off: block 2 restarts at week 5.
    const p = seasonPosition(start, weeks(0, 1, 2, 3, 4, 5), day(8 * 7));
    expect(p).toMatchObject({ week: 5, resume: { kind: 'restart', firstSessionOnly: false }, restarts: 1 });
  });

  it('keeps going after the restart week', () => {
    const p = seasonPosition(start, [...weeks(0, 1, 2, 3, 4, 5), ...weeks(8)], day(9 * 7));
    expect(p).toMatchObject({ week: 6, resume: null });
  });

  it('finishes after twelve weeks with sessions', () => {
    const all = weeks(...Array.from({ length: 12 }, (_, i) => i));
    expect(seasonPosition(start, all, day(12 * 7))).toMatchObject({ finished: true, week: 12 });
  });
});
