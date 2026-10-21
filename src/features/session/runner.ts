/**
 * Guided-session state machine: walk through the steps, rest between sets, finish. Strength sessions
 * do all sets of a step before the next; circuits do one pass over every station per round.
 * Loads, RPE logging and the +1 rule arrive with the session engine (milestone 3).
 */
import type { PlayableSession } from './playable';

export type RunnerState = {
  stepIndex: number;
  /** 0-based set (strength) or round (circuit) about to be done. */
  setIndex: number;
  /** Epoch ms at which the current rest ends, or null when not resting. */
  restEndsAt: number | null;
  /** Length of the current rest, seconds (for the ring). */
  restTotal: number;
  /** Sets logged per step. */
  done: number[];
  finished: boolean;
  startedAt: number;
};

export function startRunner(session: PlayableSession, now: number): RunnerState {
  return {
    stepIndex: 0,
    setIndex: 0,
    restEndsAt: null,
    restTotal: 0,
    done: session.steps.map(() => 0),
    finished: session.steps.length === 0,
    startedAt: now,
  };
}

function rest(seconds: number, now: number): Pick<RunnerState, 'restEndsAt' | 'restTotal'> {
  return seconds > 0 ? { restEndsAt: now + seconds * 1000, restTotal: seconds } : { restEndsAt: null, restTotal: 0 };
}

/** Logs the current set and moves on: next set or station, next step or round, or the end. */
export function logSet(session: PlayableSession, s: RunnerState, now: number): RunnerState {
  if (s.finished) return s;
  const step = session.steps[s.stepIndex];
  if (!step) return { ...s, finished: true };
  const done = s.done.map((n, i) => (i === s.stepIndex ? n + 1 : n));
  const lastStep = s.stepIndex + 1 >= session.steps.length;

  if (session.order === 'rounds') {
    const lastRound = s.setIndex + 1 >= step.sets;
    if (!lastStep) return { ...s, done, stepIndex: s.stepIndex + 1, ...rest(step.restSeconds, now) };
    if (lastRound) return { ...s, done, restEndsAt: null, restTotal: 0, finished: true };
    return { ...s, done, stepIndex: 0, setIndex: s.setIndex + 1, ...rest(session.betweenRoundsSeconds, now) };
  }

  const lastSet = s.setIndex + 1 >= step.sets;
  if (lastSet && lastStep) return { ...s, done, setIndex: step.sets, restEndsAt: null, restTotal: 0, finished: true };
  return lastSet
    ? { ...s, done, stepIndex: s.stepIndex + 1, setIndex: 0, ...rest(step.restSeconds, now) }
    : { ...s, done, setIndex: s.setIndex + 1, ...rest(step.restSeconds, now) };
}

export function skipRest(s: RunnerState): RunnerState {
  return { ...s, restEndsAt: null, restTotal: 0 };
}

/** Whole seconds left in the current rest (0 when not resting). */
export function restLeft(s: RunnerState, now: number): number {
  return s.restEndsAt == null ? 0 : Math.max(0, Math.ceil((s.restEndsAt - now) / 1000));
}

/** Total sets the session asks for (strength) or rounds × stations (circuit). */
export function totalToLog(session: PlayableSession): number {
  return session.steps.reduce((n, st) => n + st.sets, 0);
}

/** "24:10" */
export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const sec = Math.floor(totalSeconds % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}
