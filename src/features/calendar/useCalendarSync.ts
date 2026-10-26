import { useEffect } from 'react';

import type { DayPlan } from '@/features/onboarding/schedule';
import { useProfile } from '@/features/profile/useProfile';
import { useSeason } from '@/features/season/currentWeek';
import { isoDate } from '@/lib/dates';

import { clearCalendar, syncCalendar } from './device';
import { planCalendar } from './plan';

/**
 * Keeps the "Own" calendar in line with the week and time chosen, once onboarding is stored and
 * only if she asked for it. Never asks for permission itself (the paywall and Settings do).
 */
export function CalendarSync(): null {
  const p = useProfile();
  const { startDate } = useSeason();
  const on = !!p.onboardedAt && p.addToCalendar;
  const key = on ? `${p.weekPlan.join()}|${p.sessionTime}|${isoDate(startDate)}` : 'off';
  useEffect(() => {
    if (key === 'off') {
      clearCalendar().catch(() => {});
      return;
    }
    const [plan, time, start] = key.split('|') as [string, string, string];
    const [y, m, d] = start.split('-').map(Number);
    syncCalendar(planCalendar(plan.split(',') as DayPlan[], time, new Date(y!, m! - 1, d!))).catch(() => {});
  }, [key]);
  return null;
}
