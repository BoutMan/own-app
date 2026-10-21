/**
 * Turns a programme session into the linear list of steps the guided session plays, for a given
 * week. Supersets become one step (both moves, back to back, then the rest); circuits become one
 * step per station with "rounds" as sets.
 */
import { exercisePhoto } from '@/content/exerciseMedia';
import { exercises as library, type Exercise } from '@/content/exercises';
import type { PhotoKey } from '@/content/photos';
import {
  circuitRoundsForWeek,
  formatRpe,
  formatTarget,
  prescriptionForWeek,
  type Session,
  type StrengthExercise,
  type WeekNumber,
} from '@/domain/programme';

export type PlayableStep = {
  key: string;
  /** "Goblet squat" or "Banded leg curl + Standing calf raise". */
  name: string;
  /** The one key word of the title. */
  accent: string;
  sets: number;
  /** Per-set target: "10–12 reps", "8 / leg", "40 s work", "12 + 15". */
  target: string;
  rpe?: string;
  /** Rest after each set (or after each round for circuits), seconds. */
  restSeconds: number;
  home?: string;
  gym?: string;
  /** Cue for both versions, or the gentler version of a circuit station. */
  note?: string;
  gentler?: string;
  muscles: string[];
  photo: PhotoKey;
  /** Common mistake from the library card (guide pp. 41–47). */
  tip?: string;
  exerciseIds: string[];
};

export type PlayableSession = {
  id: string;
  name: string;
  minutes: number;
  focus: string;
  kind: Session['kind'];
  /** `sets`: all sets of a step, then the next step. `rounds`: one pass over every step per round (circuits). */
  order: 'sets' | 'rounds';
  /** Circuits: rest between two rounds, seconds. */
  betweenRoundsSeconds: number;
  steps: PlayableStep[];
  coachNote: string;
  finisher: string;
};

const byId = new Map(library.map((e) => [e.id, e]));

function card(id: string | null): Exercise | undefined {
  return id ? byId.get(id) : undefined;
}

/** Last word of the name before any comma: "Glute bridge, 2 s pause" → "bridge". */
export function accentOf(name: string): string {
  const main = name.split(',')[0]!.split(' · ')[0]!.trim();
  return main.split(' ').pop() ?? main;
}

function targetLabel(e: StrengthExercise): string {
  const t = formatTarget(e.target);
  return e.target.kind === 'reps' && !e.target.perSide ? `${t} reps` : t;
}

function photoFor(id: string | null): PhotoKey {
  const c = card(id);
  return exercisePhoto(id ?? 'none', c?.family ?? 'lower');
}

function strengthSteps(session: Extract<Session, { kind: 'strength' }>, week: WeekNumber): PlayableStep[] {
  const steps: PlayableStep[] = [];
  const lines = session.exercises.map((e) => prescriptionForWeek(e, week));
  for (let i = 0; i < lines.length; i++) {
    const e = lines[i]!;
    const partner = e.superset ? lines[i + 1] : undefined;
    if (partner && partner.superset === e.superset) {
      const ids = [e.exerciseId, partner.exerciseId].filter((x): x is string => x !== null);
      steps.push({
        key: `${e.slot}+${partner.slot}`,
        name: `${e.name} + ${partner.name}`,
        accent: accentOf(partner.name),
        sets: Math.max(e.sets, partner.sets),
        target: `${formatTarget(e.target)} + ${formatTarget(partner.target)}`,
        rpe: formatRpe(e.rpe),
        restSeconds: partner.restSeconds ?? 0,
        note: [e.note, partner.note].filter(Boolean).join(' · ') || undefined,
        home: e.home,
        gym: e.gym,
        muscles: [...new Set([...(card(e.exerciseId)?.muscles ?? []), ...(card(partner.exerciseId)?.muscles ?? [])])].slice(0, 3),
        photo: photoFor(e.exerciseId),
        tip: card(e.exerciseId)?.mistake,
        exerciseIds: ids,
      });
      i++;
      continue;
    }
    steps.push({
      key: e.slot,
      name: e.name,
      accent: accentOf(e.name),
      sets: e.sets,
      target: targetLabel(e),
      rpe: formatRpe(e.rpe),
      restSeconds: e.restSeconds ?? 0,
      home: e.home,
      gym: e.gym,
      note: e.note,
      muscles: card(e.exerciseId)?.muscles.slice(0, 3) ?? [],
      photo: photoFor(e.exerciseId),
      tip: card(e.exerciseId)?.mistake,
      exerciseIds: e.exerciseId ? [e.exerciseId] : [],
    });
  }
  return steps;
}

function circuitSteps(session: Extract<Session, { kind: 'circuit' }>, week: WeekNumber): PlayableStep[] {
  const rounds = circuitRoundsForWeek(session, week) ?? session.format.rounds;
  return session.exercises.map((e) => ({
    key: e.slot,
    name: e.name,
    accent: accentOf(e.name),
    sets: rounds,
    target: `${session.format.workSeconds} s work`,
    rpe: e.rpe ? formatRpe(e.rpe) : undefined,
    restSeconds: session.format.restSeconds,
    home: e.home,
    gym: e.gym,
    note: e.watch,
    gentler: e.gentler,
    muscles: card(e.exerciseId)?.muscles.slice(0, 3) ?? [],
    photo: photoFor(e.exerciseId),
    tip: card(e.exerciseId)?.mistake,
    exerciseIds: e.exerciseId ? [e.exerciseId] : [],
  }));
}

export function toPlayable(session: Session, week: WeekNumber): PlayableSession {
  return {
    id: session.id,
    name: session.name,
    minutes: session.minutes,
    focus: session.focus,
    kind: session.kind,
    order: session.kind === 'circuit' ? 'rounds' : 'sets',
    betweenRoundsSeconds: session.kind === 'circuit' ? session.format.betweenRoundsSeconds : 0,
    steps: session.kind === 'strength' ? strengthSteps(session, week) : circuitSteps(session, week),
    coachNote: session.coachNote,
    finisher: session.finisher.text,
  };
}
