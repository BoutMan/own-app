import { useDb, useQuery } from '@/db/DbProvider';
import { exerciseHistory, recentCheckIns, updateProfile } from '@/db/repositories';
import { fatigueSigns, fatigueSignLabels, shouldOfferDeload, type FatigueSign } from '@/domain/engine/overtraining';
import { isStalled } from '@/domain/engine/plusOne';
import { mondayOf } from '@/domain/engine/season';
import { progressionRules, sessionsForWeek } from '@/domain/programme';
import { toPlayable } from '@/features/session/playable';
import { isoDate } from '@/lib/dates';

import type { SeasonState } from './currentWeek';

export type DeloadOffer =
  | { reason: 'fatigue'; signs: FatigueSign[]; title: string; text: string }
  | { reason: 'stall'; exercise: string; title: string; text: string };

/** The loaded strength moves of this week's sessions: the ones whose trend means something. */
function mainExercises(week: SeasonState['week']): { id: string; name: string }[] {
  const seen = new Map<string, string>();
  for (const s of sessionsForWeek(week)) {
    if (s.kind !== 'strength') continue;
    for (const step of toPlayable(s, week).steps)
      for (const p of step.parts) if (p.exerciseId && p.loadable && !seen.has(p.exerciseId)) seen.set(p.exerciseId, p.name);
  }
  return [...seen].map(([id, name]) => ({ id, name }));
}

/**
 * Offers a deload week now (spec, "Le moteur de progression"): two signs of overtraining, or a
 * stall on a main move (p. 38). Never during a deload or test week, nor once taken this week.
 */
export function useDeloadOffer(season: SeasonState): { offer: DeloadOffer | null; take: () => void } {
  const { write } = useDb();
  const offer = useQuery(
    (db): DeloadOffer | null => {
      if (season.season === null || season.adjustments.some((a) => a.reason === 'deload' || a.reason === 'earlyDeload' || a.reason === 'testWeek')) return null;
      const moves = mainExercises(season.week).map((m) => ({ ...m, history: exerciseHistory(db, m.id, 4) }));
      const signs = fatigueSigns(recentCheckIns(db, season.season, 2), moves.map((m) => m.history));
      if (shouldOfferDeload(signs)) {
        return {
          reason: 'fatigue',
          signs,
          title: 'Your body is asking for a lighter week',
          text: `${signs.map((s) => fatigueSignLabels[s]).join(' · ')}. Two signs at once: take your deload now, 2 sets and loads −30 % until Sunday.`,
        };
      }
      const stalled = moves.find((m) => isStalled(m.history));
      if (stalled) {
        return {
          reason: 'stall',
          exercise: stalled.name,
          title: `Stuck on the ${stalled.name.toLowerCase()}`,
          text: `Three sessions without progress. Check ${progressionRules.stallChecklist.join(', ').toLowerCase()}. ${progressionRules.stallRemedy}`,
        };
      }
      return null;
    },
    [season.season, season.week, season.adjustments],
  );
  const take = () => write((db) => updateProfile(db, { earlyDeloadWeekOf: isoDate(mondayOf(new Date())) }));
  return { offer, take };
}
