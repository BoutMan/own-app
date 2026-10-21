/**
 * The programme as written in the guide (docs/Eclat-Movement-Guide.pdf): a 12-week season made of
 * three 4-week blocks, each with three sessions (A, B, C). This is static content: what the user
 * actually does is stored separately, on the device (src/db).
 */

export type BlockNumber = 1 | 2 | 3;
export type SessionLetter = 'A' | 'B' | 'C';
export type WeekNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
/** "b1-a" … "b3-c" */
export type SessionId = `b${BlockNumber}-${Lowercase<SessionLetter>}`;

/** What one set asks for. */
export type RepTarget =
  /** 10–12 reps; `perSide` when counted per leg, arm or side ("8 / leg"). */
  | { kind: 'reps'; min: number; max: number; perSide?: 'leg' | 'arm' | 'side' }
  /** A hold, in seconds ("20–30 s"). */
  | { kind: 'hold'; minSeconds: number; maxSeconds: number }
  /** "max − 2": as many clean reps as possible minus two. */
  | { kind: 'maxMinus'; minus: number };

export type Rpe = { min: number; max: number };

/** One line of a strength session table. */
export type StrengthExercise = {
  /** Position in the table: "1" … "6", or "5·A1" for a superset half. */
  slot: string;
  name: string;
  /** Card in the library (src/content/exercises.ts), when one matches. */
  exerciseId: string | null;
  sets: number;
  target: RepTarget;
  rpe: Rpe;
  /** Rest after each set, in seconds. Null inside a superset: go straight to the second half. */
  restSeconds: number | null;
  /** Superset group ("A", "B"): exercises done back to back, then the rest. */
  superset?: string;
  home?: string;
  gym?: string;
  /** Cue that applies to both versions. */
  note?: string;
};

/** One station of a circuit session. */
export type CircuitExercise = {
  slot: string;
  name: string;
  exerciseId: string | null;
  /** What to watch (block 1) */
  watch?: string;
  /** Easier version to switch to under fatigue (blocks 2–3). */
  gentler?: string;
  gym?: string;
  home?: string;
  rpe?: Rpe;
};

export type CircuitFormat = {
  rounds: number;
  workSeconds: number;
  /** Built-in transition after each station. */
  restSeconds: number;
  betweenRoundsSeconds: number;
};

type SessionBase = {
  id: SessionId;
  block: BlockNumber;
  letter: SessionLetter;
  /** "Anchor", "Upper body", "Power"… */
  name: string;
  /** "lower body & push" */
  focus: string;
  minutes: number;
  /** Every session starts with the universal warm-up (p. 25). */
  warmUp: true;
  finisher: { text: string; optional: boolean };
  coachNote: string;
  /** Page in the guide. */
  page: number;
};

export type StrengthSession = SessionBase & { kind: 'strength'; exercises: StrengthExercise[] };
export type CircuitSession = SessionBase & { kind: 'circuit'; format: CircuitFormat; exercises: CircuitExercise[] };
export type Session = StrengthSession | CircuitSession;

export type Block = {
  number: BlockNumber;
  /** App name. The guide calls block 3 "Éclat"; the app (Own) calls it "Glow", as in the mockups. */
  name: string;
  weeks: readonly [WeekNumber, WeekNumber, WeekNumber, WeekNumber];
  intention: string;
  /** One-line summary used in lists (mockup copy). */
  summary: string;
  realGoal: string;
  loadInstruction: string;
  rpe: Rpe;
  strengthPerWeek: number;
  cardioPerWeek: number;
  sessions: readonly [Session, Session, Session];
  page: number;
};

export type WeekPhase = 'learn' | 'build' | 'deload' | 'test';

/**
 * What changes in a given week compared with the session tables. Only rules the guide states
 * explicitly are encoded; anything else is left undefined on purpose (see docs/programme-notes.md).
 */
export type WeekRule = {
  week: WeekNumber;
  block: BlockNumber;
  phase: WeekPhase;
  /** Caps the sets of every strength exercise (week 1: 2 sets; deloads: 2 sets). */
  maxSets?: number;
  /** Overrides the RPE target of strength exercises. */
  rpe?: Rpe;
  /** Multiplies the loads of the previous week (deload −30 % → 0.7). */
  loadFactor?: number;
  /** Overrides the number of circuit rounds. */
  circuitRounds?: number;
  /** Overrides the zone-2 minutes after circuit C. */
  zone2Minutes?: number;
  /** Review to fill in at the end of the week. */
  review?: 'day30' | 'day60' | 'day90';
  note: string;
  page: number;
};

export type MarkerId = 'energy' | 'sleep' | 'strength' | 'breath' | 'posture' | 'mood' | 'confidence';
export type TestId = 'pushUps' | 'plank' | 'squats60' | 'wallSit' | 'walk';
