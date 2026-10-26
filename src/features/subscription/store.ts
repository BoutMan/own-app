import Constants from 'expo-constants';
import { Platform } from 'react-native';
import Purchases, { type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';

import { ENTITLEMENT, FALLBACK_PLANS, toState, type Plan, type PlanId, type SubscriptionState } from './model';

type Keys = { ios?: string; android?: string };

/** Public SDK keys from app.config.ts (read from .env, never committed). */
function apiKey(): string | null {
  const keys = (Constants.expoConfig?.extra?.revenueCat ?? {}) as Keys;
  return (Platform.OS === 'ios' ? keys.ios : keys.android) || null;
}

let configured = false;
const packages: Partial<Record<PlanId, PurchasesPackage>> = {};

function stateOf(info: CustomerInfo): SubscriptionState {
  return toState(info.entitlements.active[ENTITLEMENT]);
}

/** Configures RevenueCat once, with an anonymous id (no account, nothing else sent). */
export async function start(): Promise<SubscriptionState> {
  const key = apiKey();
  if (!key) return { status: 'unconfigured' };
  if (!configured) {
    Purchases.configure({ apiKey: key });
    configured = true;
  }
  return stateOf(await Purchases.getCustomerInfo());
}

export function onChange(listener: (s: SubscriptionState) => void): () => void {
  if (!configured) return () => {};
  const l = (info: CustomerInfo) => listener(stateOf(info));
  Purchases.addCustomerInfoUpdateListener(l);
  return () => {
    Purchases.removeCustomerInfoUpdateListener(l);
  };
}

/** Store prices in the user's currency; spec prices when the store cannot answer. */
export async function plans(): Promise<Record<PlanId, Plan>> {
  if (!configured) return FALLBACK_PLANS;
  try {
    const current = (await Purchases.getOfferings()).current;
    const out = { ...FALLBACK_PLANS };
    for (const [id, pkg] of [['yearly', current?.annual], ['monthly', current?.monthly]] as const) {
      if (!pkg) continue;
      packages[id] = pkg;
      const intro = pkg.product.introPrice;
      out[id] = {
        id,
        price: pkg.product.priceString,
        perWeek: id === 'yearly' ? pkg.product.pricePerWeekString : null,
        trialDays: intro && intro.price === 0 ? (intro.periodUnit === 'WEEK' ? 7 * intro.periodNumberOfUnits : intro.periodNumberOfUnits) : null,
      };
    }
    return out;
  } catch {
    return FALLBACK_PLANS;
  }
}

/** Null when the user cancelled the store sheet. */
export async function buy(id: PlanId): Promise<SubscriptionState | null> {
  const pkg = packages[id];
  if (!pkg) throw new Error('This plan is not available right now. Check your connection and try again.');
  try {
    return stateOf((await Purchases.purchasePackage(pkg)).customerInfo);
  } catch (e) {
    if ((e as { userCancelled?: boolean | null }).userCancelled) return null;
    throw e;
  }
}

export async function restore(): Promise<SubscriptionState> {
  return stateOf(await Purchases.restorePurchases());
}

/** Opens the App Store's own subscription page (cancel, change plan). */
export async function manage(): Promise<void> {
  await Purchases.showManageSubscriptions();
}

/** Guide buyers redeem an App Store offer code on Apple's own sheet (iOS): no server needed. */
export async function redeemCode(): Promise<void> {
  if (Platform.OS === 'ios' && configured) await Purchases.presentCodeRedemptionSheet();
}

/** Web preview only (store.web.ts); nothing to reset on a phone. */
export function resetPreviewSubscription(): void {}
