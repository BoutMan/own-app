import { useEffect } from 'react';

import { useProfile } from '@/features/profile/useProfile';

import { scheduleReminders } from './notifications';
import { planReminders } from './plan';

/** Keeps the scheduled notifications in line with the profile, once onboarding is stored. */
export function useReminderSync(): void {
  const p = useProfile();
  const plan = p.onboardedAt ? planReminders(p) : [];
  // Rescheduled only when the plan itself changes, not on every profile read.
  const key = JSON.stringify(plan);
  useEffect(() => {
    scheduleReminders(JSON.parse(key) as typeof plan).catch(() => {});
  }, [key]);
}

/** Mounted once under DbProvider. */
export function ReminderSync(): null {
  useReminderSync();
  return null;
}
