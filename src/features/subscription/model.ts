/**
 * Subscription (CLAUDE.md): hard paywall after onboarding, 7-day trial, $59.99/year highlighted or
 * $14.99/month, sold through StoreKit / Google Play via RevenueCat. RevenueCat only ever sees an
 * anonymous purchase id: no health or training data goes with it.
 */

export type PlanId = 'yearly' | 'monthly';

/** Entitlement configured in the RevenueCat dashboard. */
export const ENTITLEMENT = 'own';

export type Plan = {
  id: PlanId;
  /** "$59.99" from the store, in the user's currency. */
  price: string;
  /** "$1.15" for the yearly plan. */
  perWeek: string | null;
  /** Free trial length in days, when the store offers one. */
  trialDays: number | null;
};

/** Spec prices, shown while the store has not answered (or offline). */
export const FALLBACK_PLANS: Record<PlanId, Plan> = {
  yearly: { id: 'yearly', price: '$59.99', perWeek: '$1.15', trialDays: 7 },
  monthly: { id: 'monthly', price: '$14.99', perWeek: null, trialDays: null },
};

export type SubscriptionState =
  | { status: 'loading' }
  /** No store key in this build (development): the app stays open, nothing is sold. */
  | { status: 'unconfigured' }
  | { status: 'none' }
  | { status: 'trial' | 'active'; plan: PlanId | null; startedAt: Date; renewsAt: Date | null; willRenew: boolean };

export function isUnlocked(s: SubscriptionState): boolean {
  return s.status === 'trial' || s.status === 'active' || s.status === 'unconfigured' || s.status === 'loading';
}

/** What an entitlement looks like to the app, whatever the store. */
export type EntitlementSnapshot = {
  isActive: boolean;
  periodType: string;
  productIdentifier: string;
  originalPurchaseDate: string;
  expirationDate: string | null;
  willRenew: boolean;
};

export function toState(e: EntitlementSnapshot | undefined): SubscriptionState {
  if (!e || !e.isActive) return { status: 'none' };
  const id = e.productIdentifier.toLowerCase();
  return {
    status: e.periodType.toUpperCase() === 'TRIAL' ? 'trial' : 'active',
    plan: id.includes('year') || id.includes('annual') ? 'yearly' : id.includes('month') ? 'monthly' : null,
    startedAt: new Date(e.originalPurchaseDate),
    renewsAt: e.expirationDate ? new Date(e.expirationDate) : null,
    willRenew: e.willRenew,
  };
}

/** The paywall promises a reminder 2 days before the trial ends: 10 am that day, if still ahead. */
export function trialReminderDate(s: SubscriptionState, now = new Date()): Date | null {
  if (s.status !== 'trial' || !s.renewsAt || !s.willRenew) return null;
  const d = new Date(s.renewsAt.getFullYear(), s.renewsAt.getMonth(), s.renewsAt.getDate() - 2, 10, 0);
  return d > now ? d : null;
}

const short = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

/** Plan card on Me, Settings and the subscription screen: a title and one line. */
export function planSummary(s: SubscriptionState, plans: Record<PlanId, Plan>): { title: string; line: string } {
  if (s.status === 'loading') return { title: 'Own', line: 'Checking your plan…' };
  if (s.status === 'unconfigured') return { title: 'Own', line: 'Store not set up in this build' };
  if (s.status === 'none') return { title: 'Own', line: 'No active plan' };
  const plan = s.plan ?? 'yearly';
  const title = plan === 'yearly' ? 'Own Yearly' : 'Own Monthly';
  const per = plan === 'yearly' ? 'year' : 'month';
  if (!s.renewsAt) return { title, line: 'Active' };
  if (!s.willRenew) return { title, line: `Ends ${short(s.renewsAt)} · will not renew` };
  if (s.status === 'trial') return { title, line: `Free trial · ends ${short(s.renewsAt)} · then ${plans[plan].price} / ${per}` };
  return { title, line: `Renews ${short(s.renewsAt)} · ${plans[plan].price} / ${per}` };
}
