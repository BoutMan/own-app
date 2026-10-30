import { Share } from 'react-native';

/**
 * "Send my start date to a friend" (spec, onboarding 7/7; the guide's last tip, p. 54). Only the
 * date goes in the message, chosen and sent by her through the share sheet.
 */
export async function shareStartDate(start: Date): Promise<void> {
  const day = start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const message = `I'm starting a 12-week strength season on ${day}. Ask me how it's going?`;
  try {
    await Share.share({ message });
  } catch {
    // No share sheet (some browsers): nothing to do.
  }
}
