/**
 * Turns a programme session into the linear list of steps the guided session plays, for a given
 * week. Supersets become one step (both moves, back to back, then the rest); circuits become one
 * step per station with "rounds" as sets.
 */
import { exercisePhoto } from '@/content/exerciseMedia';
import { exercises as library, type Exercise } from '@/content/exercises';
import type { PhotoKey } from '@/content/photos';
import { caseAdjustments, type Adjustment } from '@/domain/engine/adjustments';
import type { Line } from '@/domain/engine/plusOne';
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
  /** What the user logs per set: reps (+ load), seconds of a hold, or just "done". */
  input: 'reps' | 'hold' | 'done';
  /** Prescription fed to the +1 rule (single strength lines only). */
  line?: Line;
  /**
   * Everything logged on this step, one entry per exercise: one for a single line, two for a
   * superset (both moves, each with its own reps and load), one per circuit station (reps done in
   * the work window). Empty when there is nothing to count.
   */
  parts: LogPart[];
};

export type LogPart = {
  exerciseId: string | null;
  name: string;
  input: 'reps' | 'hold';
  line: Line;
  /** Circuits: reps in a time window, compared only with other circuit rounds. */
  history: 'strength' | 'circuit';
  /** Loads make no sense on most circuit stations. */
  loadable: boolean;
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
        input: 'done',
        parts: [e, partner].map((x) => ({
          exerciseId: x.exerciseId,
          name: x.name,
          input: x.target.kind === 'hold' ? ('hold' as const) : ('reps' as const),
          line: { name: x.name, target: x.target, rpe: x.rpe, sets: x.sets },
          history: 'strength' as const,
          loadable: x.target.kind !== 'hold',
        })),
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
      input: e.target.kind === 'hold' ? 'hold' : 'reps',
      line: { name: e.name, target: e.target, rpe: e.rpe, sets: e.sets },
      parts: [
        {
          exerciseId: e.exerciseId,
          name: e.name,
          input: e.target.kind === 'hold' ? 'hold' : 'reps',
          line: { name: e.name, target: e.target, rpe: e.rpe, sets: e.sets },
          history: 'strength',
          loadable: e.target.kind !== 'hold',
        },
      ],
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
    input: 'done' as const,
    parts: [
      {
        exerciseId: e.exerciseId,
        name: e.name,
        input: 'reps' as const,
        // Reps in the work window: no ceiling, the +1 is "one more rep than last round".
        line: { name: e.name, target: { kind: 'maxMinus', minus: 0 } as const, rpe: e.rpe ?? { min: 7, max: 8 }, sets: rounds },
        history: 'circuit' as const,
        loadable: false,
      },
    ],
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

/** Early deload (stall or two signs of fatigue): the deload-week rule, 2 sets per strength line (p. 23). */
export function capSets(session: PlayableSession, max: number): PlayableSession {
  if (session.kind !== 'strength') return session;
  return { ...session, steps: session.steps.map((st) => (st.sets > max ? { ...st, sets: max } : st)) };
}

/**
 * The seven "My week is complicated" cases (guide p. 55) that change today's session, plus the
 * bare minimum (p. 53), the "10-min version" on Today.
 */
export type Variant = 'full' | 'short' | 'away' | 'ill' | 'period' | 'packed' | 'noKit' | 'tenMin';

export function isVariant(v: string | undefined): v is Variant {
  return v !== undefined && ['full', 'short', 'away', 'ill', 'period', 'packed', 'noKit', 'tenMin'].includes(v);
}

/**
 * The bare minimum, guide p. 53: 3 rounds of 15 squats, 10 push-ups (at your level), 15 glute
 * bridges, 30 s of plank, no rest between exercises, 1 minute between rounds. It counts as the
 * session of the day. Nothing is counted for the +1: "it won't make you progress".
 */
export function bareMinimum(base: PlayableSession): PlayableSession {
  const station = (key: string, id: string, name: string, target: string, note?: string): PlayableStep => ({
    key: `bm-${key}`,
    name,
    accent: accentOf(name),
    sets: 3,
    target,
    restSeconds: 0,
    ...(note ? { note } : {}),
    muscles: card(id)?.muscles.slice(0, 3) ?? [],
    photo: photoFor(id),
    tip: card(id)?.mistake,
    exerciseIds: [id],
    input: 'done',
    parts: [],
  });
  return {
    ...base,
    name: 'The bare minimum',
    minutes: 10,
    focus: 'ten minutes that count',
    kind: 'circuit',
    order: 'rounds',
    betweenRoundsSeconds: 60,
    steps: [
      station('squat', 'goblet-squat', 'Bodyweight squat', '15 reps', 'No load'),
      station('push', 'push-ups', 'Push-ups', '10 reps', 'At your level: wall, table, knees or floor'),
      station('bridge', 'glute-bridge', 'Glute bridge', '15 reps'),
      station('plank', 'plank', 'Plank', '30 s'),
    ],
    coachNote: 'It won\'t make you progress. It will do something more important: it will stop you from stopping.',
    finisher: '',
  };
}

export type VariantResult = {
  session: PlayableSession;
  adjustments: Adjustment[];
  /** Forces the home version of every line. */
  homeOnly: boolean;
  banner?: { title: string; message: string };
};

const isCore = (st: PlayableStep) => st.exerciseIds.some((id) => card(id)?.family === 'core');

/** Applies a "My week is complicated" case to a session (guide p. 55). */
export function applyVariant(session: PlayableSession, variant: Variant): VariantResult {
  switch (variant) {
    case 'tenMin':
      return {
        session: bareMinimum(session),
        adjustments: [],
        homeOnly: true,
        banner: { title: 'The bare minimum', message: 'Ten minutes, no equipment, and it counts as today\'s session. You never miss twice in a row.' },
      };
    case 'short':
      return {
        session: { ...session, steps: session.steps.slice(0, 3), finisher: '' },
        adjustments: [],
        homeOnly: false,
        banner: { title: 'Only 20 minutes', message: 'The first three exercises, in order, without the finisher. They are always the most important ones.' },
      };
    case 'away':
      return {
        session,
        adjustments: [],
        homeOnly: true,
        banner: { title: 'Away for a few days', message: 'Session C with a band, plus a walk. Three days without strength work cost you nothing.' },
      };
    case 'ill':
      return { session, adjustments: [caseAdjustments.illness], homeOnly: false, banner: caseAdjustments.illness };
    case 'period': {
      const steps = session.steps.filter((st) => !isCore(st));
      return {
        session: { ...session, steps: steps.length ? steps : session.steps, finisher: 'A 10-minute walk instead of the core work.' },
        adjustments: [caseAdjustments.period],
        homeOnly: false,
        banner: caseAdjustments.period,
      };
    }
    case 'packed':
      return { session, adjustments: [], homeOnly: true, banner: { title: 'The gym is packed', message: 'Home version of each line, no queue. The first exercise stays first.' } };
    case 'noKit':
      return {
        session: { ...session, steps: session.steps.map((st) => ({ ...st, note: ['Tempo 3-1-1: three seconds down, one pause, one up', st.note].filter(Boolean).join(' · ') })) },
        adjustments: [],
        homeOnly: true,
        banner: { title: 'No equipment today', message: 'Bodyweight with a 3-1-1 tempo. A slow bodyweight squat beats a sloppy loaded one.' },
      };
    default:
      return { session, adjustments: [], homeOnly: false };
  }
}
