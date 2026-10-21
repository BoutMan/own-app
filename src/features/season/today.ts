import { useMemo } from 'react';

import { useQuery } from '@/db/DbProvider';
import { exerciseHistory, finishedWorkouts } from '@/db/repositories';
import { adjustLoadKg } from '@/domain/engine/adjustments';
import { suggestNext, type Suggestion } from '@/domain/engine/plusOne';
import { mondayOf } from '@/domain/engine/season';
import { sessionsForWeek, type Session } from '@/domain/programme';
import { formatLoad } from '@/domain/units';
import { formatShort as formatShortDate } from '@/lib/dates';
import { toPlayable } from '@/features/session/playable';

import { useSeason, useUnits } from './currentWeek';

export type TodayPlan = {
  session: Session;
  /** Session ids already done this calendar week. */
  doneThisWeek: string[];
  weekComplete: boolean;
  /** The +1 of the first loaded exercise of today's session. */
  plusOne: Suggestion | undefined;
  /** Load to use on that exercise today, after deload/return adjustments. */
  plusOneLoad: string | undefined;
};

/** Today's session: the next one of the week not done yet (A, then B, then C). */
export function useTodayPlan(): TodayPlan & ReturnType<typeof useSeason> {
  const season = useSeason();
  const units = useUnits();
  const sessions = sessionsForWeek(season.week);
  const doneThisWeek = useQuery(
    (db) => {
      if (season.season === null) return [];
      const monday = mondayOf(new Date()).getTime();
      return finishedWorkouts(db, season.season)
        .filter((w) => new Date(w.startedAt).getTime() >= monday)
        .map((w) => w.sessionId);
    },
    [season.season],
  );
  const session = sessions.find((s) => !doneThisWeek.includes(s.id)) ?? sessions[0]!;
  const plusOne = useQuery(
    (db) => {
      for (const step of toPlayable(session, season.week).steps) {
        const id = step.exerciseIds[0];
        if (!id || !step.line) continue;
        const history = exerciseHistory(db, id);
        if (history.length) return suggestNext(step.line, history, units);
      }
      return undefined;
    },
    [session.id, season.week, units],
  );
  return useMemo(
    () => ({
      ...season,
      session,
      doneThisWeek,
      weekComplete: sessions.every((s) => doneThisWeek.includes(s.id)),
      plusOne,
      plusOneLoad: plusOne?.loadKg != null ? formatLoad(adjustLoadKg(plusOne.loadKg, season.adjustments, units), units) : undefined,
    }),
    [season, session, doneThisWeek, sessions, plusOne, units],
  );
}

/** Season figures for Programme, Progress and Me (same shape as the old mock). */
export function useSeasonSummary() {
  const plan = useTodayPlan();
  const start = plan.startDate;
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + (12 + plan.extendedBy) * 7 - 1);
  const day = Math.max(1, Math.floor((Date.now() - start.getTime()) / 86_400_000) + 1);
  const short = (d: Date) => formatShortDate(d);
  return {
    number: String(plan.season ?? 1).padStart(2, '0'),
    range: `${short(start)} → ${short(end)}`,
    started: short(start),
    ends: short(end),
    week: plan.week,
    weekProgress: plan.doneThisWeek.length / 3,
    day: Math.min(day, (12 + plan.extendedBy) * 7),
    days: (12 + plan.extendedBy) * 7,
    sessionsKept: plan.sessionsKept,
    sessionsTotal: 36,
    plan,
  };
}
