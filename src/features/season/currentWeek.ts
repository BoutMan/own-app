import type { WeekNumber } from '@/domain/programme';

/**
 * The week the user is in. Mocked to week 3 (as in the mockups) until the season start date is
 * persisted (milestone 4); then it is computed from the start date and the missed-week rules.
 */
export function useCurrentWeek(): WeekNumber {
  return 3;
}
