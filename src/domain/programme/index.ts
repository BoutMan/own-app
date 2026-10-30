import { blocks } from './blocks';
import type { Block, BlockNumber, CircuitExercise, Session, SessionId, StrengthExercise, WeekNumber, WeekRule } from './types';
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

/** Library cards used by a block's sessions, in order of first appearance. */
export function exerciseIdsInBlock(block: Block): string[] {
  const ids = block.sessions.flatMap((s) => s.exercises.map((e) => e.exerciseId)).filter((x): x is string => x !== null);
  return [...new Set(ids)];
}

/** First strength line of a block that uses a library card: its home and gym versions. */
export function strengthLineFor(exerciseId: string, block: Block): StrengthExercise | undefined {
  for (const s of block.sessions) {
    if (s.kind !== 'strength') continue;
    const line = s.exercises.find((e) => e.exerciseId === exerciseId && (e.home || e.gym));
    if (line) return line;
  }
  return undefined;
}

export type Appearance = {
  block: BlockNumber;
  blockName: string;
  session: string;
  /** "3 × 10–12 reps" or "Circuit · 40 s". */
  prescription: string;
  home?: string;
  gym?: string;
  /** Circuits: the easier version to switch to under fatigue. */
  gentler?: string;
  note?: string;
  page: number;
};

/** Every place a library card appears in the programme, with its home, gym and gentler versions ("See variations"). */
export function exerciseAppearances(exerciseId: string): Appearance[] {
  const out: Appearance[] = [];
  for (const b of blocks) {
    for (const s of b.sessions) {
      for (const e of s.exercises) {
        if (e.exerciseId !== exerciseId) continue;
        const base = { block: b.number, blockName: b.name, session: `Session ${s.letter} · ${s.name}`, page: s.page };
        if (s.kind === 'strength') {
          const x = e as StrengthExercise;
          out.push({ ...base, prescription: `${x.sets} × ${formatTarget(x.target)}`, ...(x.home ? { home: x.home } : {}), ...(x.gym ? { gym: x.gym } : {}), ...(x.note ? { note: x.note } : {}) });
        } else {
          const c = e as CircuitExercise;
          out.push({
            ...base,
            prescription: `Circuit · ${s.format.workSeconds} s`,
            ...(c.home ? { home: c.home } : {}),
            ...(c.gym ? { gym: c.gym } : {}),
            ...(c.gentler ? { gentler: c.gentler } : {}),
            ...(c.watch ? { note: c.watch } : {}),
          });
        }
      }
    }
  }
  return out;
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
