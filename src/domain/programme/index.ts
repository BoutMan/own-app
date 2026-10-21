import { blocks } from './blocks';
import type { Block, Session, SessionId, StrengthExercise, WeekNumber, WeekRule } from './types';
import { weekRules } from './weeks';

export * from './baseline';
export * from './progression';
export * from './types';
export { blocks } from './blocks';
export { warmUp } from './warmup';
export { weekRules } from './weeks';

export const SEASON_WEEKS = 12;

export const allSessions: readonly Session[] = blocks.flatMap((b) => b.sessions);

export function getSession(id: string): Session | undefined {
  return allSessions.find((s) => s.id === id);
}

export function isSessionId(id: string): id is SessionId {
  return getSession(id) !== undefined;
}

export function blockForWeek(week: WeekNumber): Block {
  return blocks[Math.floor((week - 1) / 4)]!;
}

export function weekRule(week: WeekNumber): WeekRule {
  return weekRules[week - 1]!;
}

/** The three sessions of a given week, in order A, B, C. */
export function sessionsForWeek(week: WeekNumber): readonly Session[] {
  return blockForWeek(week).sessions;
}

/** Sets and RPE of a strength line once the week's rule is applied (week 1 and deloads cap sets). */
export function prescriptionForWeek(exercise: StrengthExercise, week: WeekNumber): StrengthExercise {
  const rule = weekRule(week);
  return {
    ...exercise,
    sets: rule.maxSets ? Math.min(exercise.sets, rule.maxSets) : exercise.sets,
    rpe: rule.rpe ?? exercise.rpe,
  };
}

/** Rounds of a circuit session for a given week. */
export function circuitRoundsForWeek(session: Session, week: WeekNumber): number | null {
  if (session.kind !== 'circuit') return null;
  return weekRule(week).circuitRounds ?? session.format.rounds;
}

/** "10–12", "8 / leg", "20–30 s", "max − 2" */
export function formatTarget(target: StrengthExercise['target']): string {
  switch (target.kind) {
    case 'reps': {
      const n = target.min === target.max ? `${target.min}` : `${target.min}–${target.max}`;
      return target.perSide ? `${n} / ${target.perSide}` : n;
    }
    case 'hold':
      return target.minSeconds === target.maxSeconds ? `${target.minSeconds} s` : `${target.minSeconds}–${target.maxSeconds} s`;
    case 'maxMinus':
      return `max − ${target.minus}`;
  }
}

/** "RPE 7" · "RPE 7–8" */
export function formatRpe(r: { min: number; max: number }): string {
  return r.min === r.max ? `RPE ${r.min}` : `RPE ${r.min}–${r.max}`;
}

/** Total working sets of a session in a given week (circuits count rounds × stations). */
export function totalSets(session: Session, week: WeekNumber): number {
  if (session.kind === 'circuit') return (circuitRoundsForWeek(session, week) ?? 0) * session.exercises.length;
  return session.exercises.reduce((n, e) => n + prescriptionForWeek(e, week).sets, 0);
}
