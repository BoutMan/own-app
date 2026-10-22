import { colors, tones } from '@/theme';

import type { WeekDay } from '@/components';

/**
 * Placeholder data for the static screens (milestone 1). Names, dates and numbers come from the
 * mockups and are fictional — never build logic on them. Replaced by the session engine later.
 */
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

