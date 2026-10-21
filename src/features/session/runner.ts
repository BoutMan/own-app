/**
 * Minimal guided-session state machine for milestone 1: walk through sets, rest between them,
 * finish. Loads, RPE logging and the +1 rule arrive with the session engine (milestone 3).
 */
import type { SessionTemplate } from '@/content/sessionA';

export type RunnerState = {
  exerciseIndex: number;
  /** 0-based index of the set to do next in the current exercise. */
  setIndex: number;
  /** Epoch ms at which the current rest ends, or null when not resting. */
  restEndsAt: number | null;
  finished: boolean;
  startedAt: number;
};

export function startRunner(now: number): RunnerState {
  return { exerciseIndex: 0, setIndex: 0, restEndsAt: null, finished: false, startedAt: now };
}

/** Logs the current set and moves on: next set, next exercise, or the end of the session. */
export function logSet(session: SessionTemplate, s: RunnerState, now: number): RunnerState {
  if (s.finished) return s;
  const ex = session.exercises[s.exerciseIndex];
  if (!ex) return { ...s, finished: true };
  const lastSet = s.setIndex + 1 >= ex.sets;
  const lastExercise = s.exerciseIndex + 1 >= session.exercises.length;
  if (lastSet && lastExercise) return { ...s, setIndex: ex.sets, restEndsAt: null, finished: true };
  const rest = now + ex.restSeconds * 1000;
  return lastSet
    ? { ...s, exerciseIndex: s.exerciseIndex + 1, setIndex: 0, restEndsAt: rest }
    : { ...s, setIndex: s.setIndex + 1, restEndsAt: rest };
}

export function skipRest(s: RunnerState): RunnerState {
  return { ...s, restEndsAt: null };
}

/** Whole seconds left in the current rest (0 when not resting). */
export function restLeft(s: RunnerState, now: number): number {
  return s.restEndsAt == null ? 0 : Math.max(0, Math.ceil((s.restEndsAt - now) / 1000));
}

/** "24:10" */
export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const sec = Math.floor(totalSeconds % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}
