/**
 * Web preview: no store. Subscribing starts a simulated trial kept in localStorage, so the
 * paywall, the subscription screen and the trial reminder can be tried out.
 */
import { FALLBACK_PLANS, toState, type Plan, type PlanId, type SubscriptionState } from './model';

const KEY = 'own.preview.subscription';

type Saved = { plan: PlanId; startedAt: string; cancelled: boolean };

function read(): Saved | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

function stateOf(s: Saved | null): SubscriptionState {
  if (!s) return { status: 'none' };
  const start = new Date(s.startedAt);
  const trial = s.plan === 'yearly';
  const end = new Date(start.getTime() + (trial ? 7 : 30) * 86_400_000);
  return toState({
    isActive: end > new Date() || !s.cancelled,
    periodType: trial && end > new Date() ? 'TRIAL' : 'NORMAL',
    productIdentifier: s.plan === 'yearly' ? 'own_yearly' : 'own_monthly',
    originalPurchaseDate: s.startedAt,
    expirationDate: end.toISOString(),
    willRenew: !s.cancelled,
  });
}

const listeners = new Set<(s: SubscriptionState) => void>();

function save(s: Saved | null): SubscriptionState {
  try {
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  } catch {
    // Private window: the simulated subscription lasts until reload.
  }
  const state = stateOf(s);
  listeners.forEach((l) => l(state));
  return state;
}

export async function start(): Promise<SubscriptionState> {
  return stateOf(read());
}

export function onChange(listener: (s: SubscriptionState) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function plans(): Promise<Record<PlanId, Plan>> {
  return FALLBACK_PLANS;
}

export async function buy(id: PlanId): Promise<SubscriptionState | null> {
  return save({ plan: id, startedAt: new Date().toISOString(), cancelled: false });
}

export async function restore(): Promise<SubscriptionState> {
  return stateOf(read());
}

/** Preview stand-in for the App Store page: cancels the simulated subscription. */
export async function manage(): Promise<void> {
  const s = read();
  if (s) save({ ...s, cancelled: true });
}

/** The preview has no App Store sheet. */
export async function redeemCode(): Promise<void> {}

/** Preview tools: forget the simulated subscription. */
export function resetPreviewSubscription(): void {
  save(null);
}
