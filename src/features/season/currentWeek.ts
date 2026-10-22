import { useMemo } from 'react';

import { useQuery } from '@/db/DbProvider';
import { activeSeason, finishedWorkouts } from '@/db/repositories';
import { profile } from '@/db/schema';
import { caseAdjustments, weekAdjustment, type Adjustment } from '@/domain/engine/adjustments';
import { mondayOf, seasonPosition, type SeasonPosition } from '@/domain/engine/season';
import type { WeekNumber } from '@/domain/programme';
import type { UnitSystem } from '@/domain/units';
import { isoDate } from '@/lib/dates';

import { usePreviewWeek } from './previewWeek';

export type SeasonState = SeasonPosition & {
  /** Season number in the database, or null before the first session (created on the first set). */
  season: number | null;
  startDate: Date;
  /** Load adjustments in force today (deload, test week, coming back after a gap). */
  adjustments: Adjustment[];
  sessionsKept: number;
};

function parseDate(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(y!, m! - 1, d!);
}

/** Where the user is in her season, computed from what she actually did (spec: sessions, not the calendar). */
export function useSeason(): SeasonState {
  const preview = usePreviewWeek();
  const data = useQuery((db) => {
    const s = activeSeason(db);
    const earlyDeloadWeekOf = db.select({ v: profile.earlyDeloadWeekOf }).from(profile).get()?.v ?? null;
    return s ? { season: s.number, startDate: s.startDate, workouts: finishedWorkouts(db, s.number), earlyDeloadWeekOf } : null;
  });

  return useMemo(() => {
    const today = new Date();
    const startDate = data ? parseDate(data.startDate) : mondayOf(today);
    const dates = (data?.workouts ?? []).map((w) => new Date(w.startedAt));
    const pos = seasonPosition(startDate, dates, today);
    const week = preview ?? pos.week;
    const adjustments: Adjustment[] = [];
    const wa = weekAdjustment(week);
    if (wa) adjustments.push(wa);
    else if (!preview && data?.earlyDeloadWeekOf === isoDate(mondayOf(today))) adjustments.push(caseAdjustments.earlyDeload);
    if (!preview && pos.resume) adjustments.push(pos.resume.kind === 'restart' ? caseAdjustments.restart : caseAdjustments.missedWeek);
    return {
      ...pos,
      week,
      resume: preview ? null : pos.resume,
      season: data?.season ?? null,
      startDate,
      adjustments,
      sessionsKept: data?.workouts.length ?? 0,
    };
  }, [data, preview]);
}

export function useCurrentWeek(): WeekNumber {
  return useSeason().week;
}

/** Display units. Imperial until the onboarding choice is persisted (milestone 4). */
export function useUnits(): UnitSystem {
  return useQuery((db) => db.select({ units: profile.units }).from(profile).get()?.units ?? 'imperial');
}
