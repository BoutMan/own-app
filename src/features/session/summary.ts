import { exerciseHistory, getWorkout } from '@/db/repositories';
import type { Db } from '@/db/types';
import { improvedOn, suggestNext, type PastPerformance } from '@/domain/engine/plusOne';
import { getSession, type WeekNumber } from '@/domain/programme';
import { formatLoad, type UnitSystem } from '@/domain/units';

import { toPlayable } from './playable';

export type WorkoutSummary = {
  sessionName: string;
  stepsDone: number;
  stepsTotal: number;
  plusOnes: number;
  /** Headline for the "Your +1" card. */
  next: { title: string; text: string };
  feel: number | null;
};

/** What the session-complete screen shows, computed from the logged sets. */
export function summarizeWorkout(db: Db, workoutId: string, units: UnitSystem): WorkoutSummary | undefined {
  const w = getWorkout(db, workoutId);
  if (!w) return undefined;
  const session = getSession(w.sessionId);
  const playable = session ? toPlayable(session, w.week as WeekNumber) : undefined;
  const stepsDone = new Set(w.sets.map((s) => s.stepKey)).size;

  let plusOnes = 0;
  let next: WorkoutSummary['next'] | undefined;
  for (const step of playable?.steps ?? []) {
    for (const part of step.parts) {
      const id = part.exerciseId;
      if (!id) continue;
      const today: PastPerformance = {
        adjusted: w.loadFactor < 1,
        sets: w.sets
          .filter((s) => s.stepKey === step.key && s.exerciseId === id && (s.reps != null || s.seconds != null))
          .map((s) => ({ reps: s.reps, loadKg: s.loadKg, seconds: s.seconds, rpe: s.rpe })),
      };
      if (today.sets.length === 0) continue;
      const previous = exerciseHistory(db, id, 4, workoutId, part.history);
      if (!today.adjusted && improvedOn(today, previous.find((p) => !p.adjusted))) plusOnes++;
      const s = suggestNext(part.line, [today, ...previous], units);
      if (!next && s.kind === 'addLoad' && s.loadKg != null) {
        next = { title: `Top of the range on the ${part.name.toLowerCase()}`, text: `Next time we move you to ${formatLoad(s.loadKg, units)}. You earned it.` };
      }
    }
  }

  if (!next) {
    next =
      plusOnes > 0
        ? { title: `You beat last time on ${plusOnes} ${plusOnes > 1 ? 'moves' : 'move'}`, text: 'That is the +1 rule working. Same plan next time: one more rep.' }
        : { title: 'Logged. Next time, one more rep', text: 'Your loads are saved: the next session starts from here.' };
  }

  return { sessionName: session?.name ?? 'Session', stepsDone, stepsTotal: playable?.steps.length ?? stepsDone, plusOnes, next, feel: w.feel };
}
