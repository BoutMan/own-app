import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { scheduleTrialReminder } from '@/features/reminders/notifications';

import { FALLBACK_PLANS, trialReminderDate, type Plan, type PlanId, type SubscriptionState } from './model';
import * as store from './store';

type SubscriptionValue = {
  state: SubscriptionState;
  plans: Record<PlanId, Plan>;
  /** Resolves false when the user cancelled the store sheet. */
  buy: (id: PlanId) => Promise<boolean>;
  restore: () => Promise<SubscriptionState>;
  manage: () => Promise<void>;
  redeemCode: () => Promise<void>;
};

const Ctx = createContext<SubscriptionValue | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SubscriptionState>({ status: 'loading' });
  const [plans, setPlans] = useState(FALLBACK_PLANS);

  useEffect(() => {
    let stop = () => {};
    store
      .start()
      .then((s) => {
        setState(s);
        stop = store.onChange(setState);
        return store.plans();
      })
      .then(setPlans)
      // Offline or store down: stay open rather than lock someone out of a paid app.
      .catch(() => setState({ status: 'unconfigured' }));
    return () => stop();
  }, []);

  useEffect(() => {
    scheduleTrialReminder(trialReminderDate(state), plans.yearly.price).catch(() => {});
  }, [state, plans.yearly.price]);

  const buy = useCallback(async (id: PlanId) => {
    const s = await store.buy(id);
    if (s) setState(s);
    return s !== null;
  }, []);
  const restore = useCallback(async () => {
    const s = await store.restore();
    setState(s);
    return s;
  }, []);

  const value = useMemo(() => ({ state, plans, buy, restore, manage: store.manage, redeemCode: store.redeemCode }), [state, plans, buy, restore]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSubscription(): SubscriptionValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSubscription must be used inside SubscriptionProvider');
  return ctx;
}
