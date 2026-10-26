import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';

import { unlockVault, type UnlockResult } from './lock';

type VaultLockValue = {
  /** Photos may be shown. */
  open: boolean;
  /** The phone has no Face ID or passcode: the vault cannot be locked. */
  unprotected: boolean;
  unlock: () => Promise<UnlockResult>;
};

const Ctx = createContext<VaultLockValue | null>(null);

/** The vault locks again as soon as the app leaves the screen. */
export function VaultLockProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [unprotected, setUnprotected] = useState(false);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s !== 'active') setOpen(false);
    });
    return () => sub.remove();
  }, []);
  const unlock = useCallback(async () => {
    const r = await unlockVault();
    if (r !== 'cancelled') setOpen(true);
    setUnprotected(r === 'noLock');
    return r;
  }, []);
  const value = useMemo(() => ({ open, unprotected, unlock }), [open, unprotected, unlock]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useVaultLock(): VaultLockValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useVaultLock must be used inside VaultLockProvider');
  return ctx;
}
