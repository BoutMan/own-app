import type { UnlockResult } from './lock';

/** Web preview: no Face ID. The vault opens, and says so. */
export async function unlockVault(): Promise<UnlockResult> {
  return 'noLock';
}
