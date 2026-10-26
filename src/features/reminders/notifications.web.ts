import type { PlannedReminder } from './plan';

// The web preview has no local notifications: reminders are planned but never scheduled.
export async function notificationsAllowed(): Promise<boolean> {
  return false;
}

export async function askForNotifications(): Promise<boolean> {
  return false;
}

export async function scheduleReminders(_plan: readonly PlannedReminder[]): Promise<void> {}
