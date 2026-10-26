import { describe, expect, it } from '@jest/globals';

import { FALLBACK_PLANS, isUnlocked, planSummary, toState, trialReminderDate } from './model';

const trial = {
  isActive: true,
  periodType: 'TRIAL',
  productIdentifier: 'own_yearly',
  originalPurchaseDate: '2026-10-26T10:00:00Z',
  expirationDate: '2026-11-02T10:00:00Z',
  willRenew: true,
};

describe('subscription state', () => {
  it('reads a yearly trial', () => {
    const s = toState(trial);
    expect(s).toMatchObject({ status: 'trial', plan: 'yearly', willRenew: true });
    expect(isUnlocked(s)).toBe(true);
  });

  it('locks without an active entitlement', () => {
    expect(toState(undefined)).toEqual({ status: 'none' });
    expect(isUnlocked(toState({ ...trial, isActive: false }))).toBe(false);
  });

  it('sums up the plan in one line', () => {
    expect(planSummary(toState(trial), FALLBACK_PLANS).title).toBe('Own Yearly');
    expect(planSummary(toState(trial), FALLBACK_PLANS).line).toMatch(/^Free trial · ends .+ · then \$59\.99 \/ year$/);
    expect(planSummary(toState({ ...trial, willRenew: false }), FALLBACK_PLANS).line).toMatch(/will not renew$/);
    expect(planSummary({ status: 'none' }, FALLBACK_PLANS).line).toBe('No active plan');
  });

  it('reminds two days before the trial ends, only while it will renew', () => {
    const s = toState(trial);
    const d = trialReminderDate(s, new Date('2026-10-27T00:00:00'));
    const end = new Date('2026-11-02T10:00:00Z');
    expect(d).toEqual(new Date(end.getFullYear(), end.getMonth(), end.getDate() - 2, 10, 0));
    expect(trialReminderDate(toState({ ...trial, willRenew: false }))).toBeNull();
    expect(trialReminderDate(toState({ ...trial, periodType: 'NORMAL' }))).toBeNull();
  });
});
