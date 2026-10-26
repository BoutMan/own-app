import { describe, expect, it } from '@jest/globals';

import { planCalendar } from './plan';

describe('calendar', () => {
  it('plans one weekly series per session day for the 12 weeks', () => {
    const s = planCalendar(['session', 'rest', 'session', 'rest', 'session', 'walk', 'rest'], '18:30', new Date(2026, 10, 2));
    expect(s.map((x) => [x.title, x.start.getDate(), x.start.getHours(), x.start.getMinutes()])).toEqual([
      ['Own · Session A', 2, 18, 30],
      ['Own · Session B', 4, 18, 30],
      ['Own · Session C', 6, 18, 30],
    ]);
    expect((s[0]!.end.getTime() - s[0]!.start.getTime()) / 60_000).toBe(45);
    expect([s[0]!.until.getMonth(), s[0]!.until.getDate()]).toEqual([0, 24]);
  });
});
