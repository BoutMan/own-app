import { colors, tones } from '@/theme';

import type { WeekDay } from '@/components';

/**
 * Placeholder data for the static screens (milestone 1). Names, dates and numbers come from the
 * mockups and are fictional — never build logic on them. Replaced by the session engine later.
 */
export const mockUser = { firstName: 'Mia' } as const;

export const activityDot = {
  strength: colors.cocoa,
  zone2: tones.fog.ring,
  checkIn: tones.mauve.ring,
} as const;

export const mockWeek: readonly WeekDay[] = [
  { key: 'mon', weekday: 'Mon', date: '20', dot: activityDot.strength },
  { key: 'tue', weekday: 'Tue', date: '21' },
  { key: 'wed', weekday: 'Wed', date: '22', dot: activityDot.strength },
  { key: 'thu', weekday: 'Thu', date: '23' },
  { key: 'fri', weekday: 'Fri', date: '24', dot: activityDot.strength },
  { key: 'sat', weekday: 'Sat', date: '25', dot: activityDot.zone2 },
  { key: 'sun', weekday: 'Sun', date: '26', dot: activityDot.checkIn },
];

export const mockToday = {
  dateLine: 'Monday, Oct 20 · week 3 of 12',
  cyclePill: 'Follicular · good day for heavy',
  eyebrow: 'Today · Session A',
  sessionName: 'Anchor',
  sessionMeta: '35 min · lower body & push · home',
  plusOne: {
    title: 'One more rep on the goblet squat',
    text: 'Last time: 3 × 11 at 18 lb. Today, 12.',
  },
  ritualsSummary: '47% of today',
  rituals: [
    { key: 'morning', label: 'Morning flow', detail: '7 / 7 min · done at 7:42', percent: 100, tone: 'vanilla', icon: 'sun', done: true },
    { key: 'steps', label: 'Steps', detail: '4,210 / 7,000', percent: 60, tone: 'latte', icon: 'steps' },
    { key: 'water', label: 'Water', detail: '1.0 / 2 L', percent: 50, tone: 'fog', icon: 'water' },
    { key: 'protein', label: 'Protein', detail: '1 / 4 palms', percent: 25, tone: 'mauve', icon: 'protein' },
    { key: 'evening', label: 'Evening wind-down', detail: '0 / 10 min · tonight', percent: 0, tone: 'mocha', icon: 'moon' },
  ],
  myWhy: 'Getting up without that heavy tiredness, and feeling strong again.',
  cycleDay: 9,
} as const;
