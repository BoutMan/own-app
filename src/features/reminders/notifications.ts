import * as Notifications from 'expo-notifications';

import type { PlannedReminder } from './plan';

// Reminders show as banners even while the app is open (the session screen keeps them quiet: none fire mid-session by design).
Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
});

export async function notificationsAllowed(): Promise<boolean> {
  return (await Notifications.getPermissionsAsync()).granted;
}

/** Asks once, in context (contract signed, or a reminder switched on). */
export async function askForNotifications(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted || !current.canAskAgain) return current.granted;
  return (await Notifications.requestPermissionsAsync()).granted;
}

/** Replaces every scheduled reminder with the plan. Local only: nothing leaves the phone. */
export async function scheduleReminders(plan: readonly PlannedReminder[]): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!(await notificationsAllowed())) return;
  for (const r of plan) {
    await Notifications.scheduleNotificationAsync({
      identifier: r.id,
      content: { title: r.title, body: r.body },
      // Expo counts weekdays from Sunday = 1; the plan from Monday = 0.
      trigger: { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday: ((r.day + 1) % 7) + 1, hour: r.hour, minute: r.minute },
    });
  }
}
