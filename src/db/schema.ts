/**
 * Everything the user records, stored in SQLite on the device only (CLAUDE.md, rule 1).
 * Loads are in kg, lengths in cm, dates as ISO 8601 text ("2026-10-27" or a full timestamp).
 * The programme itself is static content (src/domain/programme), referenced by id.
 */
import { sql } from 'drizzle-orm';
import { check, index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

const timestamp = (name: string) =>
  text(name)
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`);

/** One row: the user's profile and preferences, filled during onboarding. */
export const profile = sqliteTable('profile', {
  id: integer('id').primaryKey(),
  firstName: text('first_name'),
  units: text('units', { enum: ['imperial', 'metric'] }).notNull().default('imperial'),
  place: text('place', { enum: ['home', 'gym'] }).notNull().default('home'),
  /** JSON array of equipment ids. */
  equipment: text('equipment', { mode: 'json' }).$type<string[]>().notNull().default(sql`'[]'`),
  /** JSON array of 7 day plans, Monday first: "rest" | "session" | "walk". */
  weekPlan: text('week_plan', { mode: 'json' }).$type<string[]>().notNull(),
  /** "18:30" local time. */
  sessionTime: text('session_time').notNull().default('18:30'),
  feelings: text('feelings', { mode: 'json' }).$type<string[]>().notNull().default(sql`'[]'`),
  myWhy: text('my_why'),
  groundedVersions: integer('grounded_versions', { mode: 'boolean' }).notNull().default(false),
  cycleTracking: integer('cycle_tracking', { mode: 'boolean' }).notNull().default(false),
  /** Opt-in only (CLAUDE.md, rule 6). */
  trackBodyWeight: integer('track_body_weight', { mode: 'boolean' }).notNull().default(false),
  remindNightBefore: integer('remind_night_before', { mode: 'boolean' }).notNull().default(true),
  addToCalendar: integer('add_to_calendar', { mode: 'boolean' }).notNull().default(true),
  contractSignedAt: text('contract_signed_at'),
  onboardedAt: text('onboarded_at'),
  createdAt: timestamp('created_at'),
});

/** Health check (onboarding 3/7). Sensitive: never exported to any service. */
export const healthAnswers = sqliteTable('health_answers', {
  id: integer('id').primaryKey(),
  pregnancyOrPostpartum: integer('pregnancy_or_postpartum', { mode: 'boolean' }).notNull().default(false),
  medicalCondition: integer('medical_condition', { mode: 'boolean' }).notNull().default(false),
  injuryOrSurgery: integer('injury_or_surgery', { mode: 'boolean' }).notNull().default(false),
  noTrainingTwoYears: integer('no_training_two_years', { mode: 'boolean' }).notNull().default(false),
  pelvicLeaking: integer('pelvic_leaking', { mode: 'boolean' }).notNull().default(false),
  pelvicHeaviness: integer('pelvic_heaviness', { mode: 'boolean' }).notNull().default(false),
  pelvicUrgency: integer('pelvic_urgency', { mode: 'boolean' }).notNull().default(false),
  updatedAt: timestamp('updated_at'),
});

/** A 12-week season. Seasons follow each other; number 1 is the first. */
export const seasons = sqliteTable('seasons', {
  number: integer('number').primaryKey(),
  startDate: text('start_date').notNull(),
  status: text('status', { enum: ['active', 'done'] }).notNull().default('active'),
  createdAt: timestamp('created_at'),
});

/** The three goals of a season (onboarding 2/7). */
export const goals = sqliteTable(
  'goals',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    season: integer('season').notNull().references(() => seasons.number, { onDelete: 'cascade' }),
    slot: text('slot', { enum: ['performance', 'sensation', 'free'] }).notNull(),
    text: text('text').notNull(),
    /** "Where I am today", in the user's words. */
    baseline: text('baseline'),
    /** 0–100, set at each block review. */
    progress: integer('progress'),
    createdAt: timestamp('created_at'),
  },
  (t) => [uniqueIndex('goals_season_slot').on(t.season, t.slot)],
);

/** One performed session (or a reduced version of it). */
export const workouts = sqliteTable(
  'workouts',
  {
    id: text('id').primaryKey(),
    /** Programme session id, e.g. "b1-a". */
    sessionId: text('session_id').notNull(),
    season: integer('season').notNull().references(() => seasons.number, { onDelete: 'cascade' }),
    week: integer('week').notNull(),
    mode: text('mode', { enum: ['home', 'gym'] }).notNull(),
    /** "full", "short" (10/20 min) or a "My week is complicated" case id. */
    variant: text('variant').notNull().default('full'),
    startedAt: text('started_at').notNull(),
    endedAt: text('ended_at'),
    /** "How did it feel?" 1–10. */
    feel: integer('feel'),
    /** Load factor applied that day (0.7 on a deload…). Below 1, the sets are not a base for progress. */
    loadFactor: real('load_factor').notNull().default(1),
  },
  (t) => [
    index('workouts_season_week').on(t.season, t.week),
    check('workouts_week_range', sql`${t.week} between 1 and 12`),
    check('workouts_feel_range', sql`${t.feel} is null or ${t.feel} between 1 and 10`),
  ],
);

/** One logged set (strength) or round (circuit station). */
export const setLogs = sqliteTable(
  'set_logs',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    workoutId: text('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
    /** Step of the session ("1", "6·A1+6·A2"). */
    stepKey: text('step_key').notNull(),
    /** Library card, when the step maps to one. */
    exerciseId: text('exercise_id'),
    setIndex: integer('set_index').notNull(),
    reps: integer('reps'),
    loadKg: real('load_kg'),
    seconds: integer('seconds'),
    rpe: real('rpe'),
    loggedAt: text('logged_at').notNull(),
  },
  (t) => [index('set_logs_exercise').on(t.exerciseId, t.loggedAt), index('set_logs_workout').on(t.workoutId)],
);

/** The seven markers, rated 1–10 at each checkpoint (day 0, 30, 60, 90). */
export const markerEntries = sqliteTable(
  'marker_entries',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    season: integer('season').notNull().references(() => seasons.number, { onDelete: 'cascade' }),
    checkpoint: text('checkpoint', { enum: ['day0', 'day30', 'day60', 'day90'] }).notNull(),
    marker: text('marker', { enum: ['energy', 'sleep', 'strength', 'breath', 'posture', 'mood', 'confidence'] }).notNull(),
    value: integer('value').notNull(),
    recordedAt: timestamp('recorded_at'),
  },
  (t) => [
    uniqueIndex('marker_entries_unique').on(t.season, t.checkpoint, t.marker),
    check('marker_value_range', sql`${t.value} between 1 and 10`),
  ],
);

/** The five baseline tests at each checkpoint. Value in reps, seconds or minutes (see baselineTests). */
export const testResults = sqliteTable(
  'test_results',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    season: integer('season').notNull().references(() => seasons.number, { onDelete: 'cascade' }),
    checkpoint: text('checkpoint', { enum: ['day0', 'day30', 'day60', 'day90'] }).notNull(),
    test: text('test', { enum: ['pushUps', 'plank', 'squats60', 'wallSit', 'walk'] }).notNull(),
    value: real('value').notNull(),
    /** e.g. push-up hand height. */
    note: text('note'),
    recordedAt: timestamp('recorded_at'),
  },
  (t) => [uniqueIndex('test_results_unique').on(t.season, t.checkpoint, t.test)],
);

/** Sunday check-in. */
export const checkIns = sqliteTable(
  'check_ins',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    season: integer('season').notNull().references(() => seasons.number, { onDelete: 'cascade' }),
    week: integer('week').notNull(),
    energy: integer('energy'),
    sleep: integer('sleep'),
    mood: integer('mood'),
    win: text('win'),
    stuck: text('stuck'),
    adjust: text('adjust'),
    createdAt: timestamp('created_at'),
  },
  (t) => [uniqueIndex('check_ins_unique').on(t.season, t.week)],
);

/** Optional body measurements (waist, hips, thigh in cm; weight in kg). Opt-in. */
export const measurements = sqliteTable('measurements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  kind: text('kind', { enum: ['waist', 'hips', 'thigh', 'weight'] }).notNull(),
  value: real('value').notNull(),
  recordedAt: timestamp('recorded_at'),
});

/** Photo vault entries. The image file stays in the app's private directory, never uploaded. */
export const vaultPhotos = sqliteTable('vault_photos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  season: integer('season').notNull().references(() => seasons.number, { onDelete: 'cascade' }),
  checkpoint: text('checkpoint', { enum: ['day0', 'day30', 'day60', 'day90'] }).notNull(),
  pose: text('pose', { enum: ['front', 'side', 'back'] }).notNull(),
  /** file:// URI inside the app sandbox. */
  fileUri: text('file_uri').notNull(),
  takenAt: timestamp('taken_at'),
});
