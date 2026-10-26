import * as LocalAuthentication from 'expo-local-authentication';

export type UnlockResult = 'unlocked' | 'cancelled' | 'noLock';

/**
 * Face ID (or the passcode) before any vault photo is shown. A phone with no lock at all cannot
 * protect the vault: we say so and open it.
 */
export async function unlockVault(): Promise<UnlockResult> {
  const level = await LocalAuthentication.getEnrolledLevelAsync();
  if (level === LocalAuthentication.SecurityLevel.NONE) return 'noLock';
  const r = await LocalAuthentication.authenticateAsync({ promptMessage: 'Open your photo vault', cancelLabel: 'Not now' });
  return r.success ? 'unlocked' : 'cancelled';
}
