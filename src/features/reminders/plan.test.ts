import { describe, expect, it } from '@jest/globals';

import { planReminders, type ReminderSettings } from './plan';

const base: ReminderSettings = {
  weekPlan: ['session', 'rest', 'session', 'rest', 'session', 'walk', 'rest'],
  sessionTime: '18:30',
  remindSession: true,
  remindNightBefore: true,
  remindSunday: true,
  remindEvening: false,
};

describe('reminders', () => {
  it('plans 30 min before each session, the night before, and Sunday', () => {
    const r = planReminders(base);
    expect(r.filter((x) => x.id.startsWith('session')).map((x) => [x.day, x.hour, x.minute])).toEqual([
      [0, 18, 0],
      [2, 18, 0],
      [4, 18, 0],
    ]);
    // Monday's night-before reminder is on Sunday evening.
    expect(r.filter((x) => x.id.startsWith('night')).map((x) => x.day)).toEqual([6, 1, 3]);
    expect(r.find((x) => x.id === 'sunday')).toMatchObject({ day: 6, hour: 18, minute: 0 });
    expect(r.find((x) => x.id === 'session-2')?.title).toBe('Session B at 6:30 pm');
  });

  it('crosses midnight and respects each switch', () => {
    const r = planReminders({ ...base, sessionTime: '00:15', remindNightBefore: false, remindSunday: false, remindEvening: true });
    expect(r.find((x) => x.id === 'session-0')).toMatchObject({ day: 6, hour: 23, minute: 45 });
    expect(r.filter((x) => x.id.startsWith('evening'))).toHaveLength(7);
    expect(r.some((x) => x.id.startsWith('night') || x.id === 'sunday')).toBe(false);
  });
});
