import { useCallback } from 'react';

import { useDb, useQuery } from '@/db/DbProvider';
import { DEFAULT_WEEK_PLAN, getProfile, periodStarts, updateProfile, type ProfilePatch } from '@/db/repositories';
import { cyclePosition, phaseAdvice, type CyclePosition } from '@/domain/engine/cycle';
import type { DayPlan } from '@/features/onboarding/schedule';

export type Profile = NonNullable<ReturnType<typeof getProfile>>;

/** The profile row, or the defaults before onboarding is stored (preview, first launch). */
export function useProfile(): Profile & { weekPlan: DayPlan[] } {
  const p = useQuery((db) => getProfile(db) ?? null);
  return {
    id: 1,
    firstName: null,
    units: 'imperial',
    place: 'home',
    equipment: [],
    sessionTime: '18:30',
    feelings: [],
    myWhy: null,
    groundedVersions: false,
    cycleTracking: false,
    trackBodyWeight: false,
    remindNightBefore: true,
    remindSession: true,
    remindSunday: true,
    remindEvening: false,
    addToCalendar: true,
    hormonalContraception: false,
    earlyDeloadWeekOf: null,
    contractSignedAt: null,
    contractSignature: null,
    savedExercises: [],
    onboardedAt: null,
    createdAt: '',
    ...p,
    weekPlan: (p?.weekPlan ?? DEFAULT_WEEK_PLAN) as DayPlan[],
  };
}

export function useUpdateProfile(): (patch: ProfilePatch) => void {
  const { write } = useDb();
  return useCallback((patch) => write((db) => updateProfile(db, patch)), [write]);
}

const parse = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y!, m! - 1, d!);
};

export type CycleState = {
  tracking: boolean;
  contraception: boolean;
  starts: Date[];
  /** Null without a recent period, or under hormonal contraception (no phases shown, spec). */
  position: CyclePosition | null;
  advice: (typeof phaseAdvice)[keyof typeof phaseAdvice] | null;
};

export function useCycle(): CycleState {
  const profile = useProfile();
  const starts = useQuery((db) => periodStarts(db)).map(parse);
  const position = profile.cycleTracking && !profile.hormonalContraception ? cyclePosition(starts, new Date()) : null;
  return {
    tracking: profile.cycleTracking,
    contraception: profile.hormonalContraception,
    starts,
    position,
    advice: position ? phaseAdvice[position.phase] : null,
  };
}
