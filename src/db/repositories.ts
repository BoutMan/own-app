/**
 * Read/write helpers over the on-device database. Pure functions of a `Db`, so the same code runs
 * on the device (expo-sqlite) and in tests (better-sqlite3).
 */
import { and, desc, eq, inArray, isNotNull } from 'drizzle-orm';

import type { PastPerformance } from '@/domain/engine/plusOne';
import type { Checkpoint, MarkerId, TestId } from '@/domain/programme';

import {
  checkIns,
  goals,
  healthAnswers,
  markerEntries,
  measurements,
  profile,
  seasons,
  setLogs,
  testResults,
  vaultPhotos,
  workouts,
} from './schema';
import type { Db } from './types';

const nowIso = () => new Date().toISOString();

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Seasons ──────────────────────────────────────────────────────────────

export function activeSeason(db: Db) {
  return db.select().from(seasons).where(eq(seasons.status, 'active')).orderBy(desc(seasons.number)).get();
}

/** Starts a new season (closing the active one) and returns its number. */
export function startSeason(db: Db, startDate: string): number {
  return db.transaction((tx) => {
    const current = tx.select().from(seasons).orderBy(desc(seasons.number)).get();
    tx.update(seasons).set({ status: 'done' }).where(eq(seasons.status, 'active')).run();
    const number = (current?.number ?? 0) + 1;
    tx.insert(seasons).values({ number, startDate }).run();
    return number;
  });
}

// ─── Workouts and sets ────────────────────────────────────────────────────

export type StartWorkout = {
  sessionId: string;
  season: number;
  week: number;
  mode: 'home' | 'gym';
  variant?: string;
  loadFactor?: number;
};

export function startWorkout(db: Db, w: StartWorkout, at = nowIso()): string {
  const id = newId('w');
  db.insert(workouts).values({ id, ...w, startedAt: at }).run();
  return id;
}

export type LoggedSet = {
  stepKey: string;
  exerciseId: string | null;
  setIndex: number;
  reps?: number;
  loadKg?: number;
  seconds?: number;
  rpe?: number;
};

/** Returns the id of the logged set (to add the RPE right after). */
export function logSet(db: Db, workoutId: string, s: LoggedSet, at = nowIso()): number {
  return db.insert(setLogs).values({ workoutId, ...s, loggedAt: at }).returning({ id: setLogs.id }).get().id;
}

export function setRpe(db: Db, setId: number, rpe: number): void {
  db.update(setLogs).set({ rpe }).where(eq(setLogs.id, setId)).run();
}

export function getWorkout(db: Db, id: string) {
  const workout = db.select().from(workouts).where(eq(workouts.id, id)).get();
  if (!workout) return undefined;
  const sets = db.select().from(setLogs).where(eq(setLogs.workoutId, id)).orderBy(setLogs.loggedAt).all();
  return { ...workout, sets };
}

/** Finished workouts of a season, oldest first. */
export function finishedWorkouts(db: Db, season: number) {
  return db
    .select()
    .from(workouts)
    .where(and(eq(workouts.season, season), isNotNull(workouts.endedAt)))
    .orderBy(workouts.startedAt)
    .all();
}

/**
 * Past performances of an exercise, most recent first, one entry per workout: the input of the +1
 * rule. Workouts done with reduced loads are flagged `adjusted`. `before` excludes a workout in progress.
 */
export function exerciseHistory(db: Db, exerciseId: string, limit = 4, excludeWorkoutId?: string): PastPerformance[] {
  const recent = db
    .selectDistinct({ id: workouts.id, startedAt: workouts.startedAt, loadFactor: workouts.loadFactor })
    .from(setLogs)
    .innerJoin(workouts, eq(setLogs.workoutId, workouts.id))
    .where(and(eq(setLogs.exerciseId, exerciseId), isNotNull(setLogs.reps)))
    .orderBy(desc(workouts.startedAt))
    .limit(limit + 1)
    .all()
    .filter((w) => w.id !== excludeWorkoutId)
    .slice(0, limit);
  if (recent.length === 0) return [];
  const rows = db
    .select()
    .from(setLogs)
    .where(and(eq(setLogs.exerciseId, exerciseId), inArray(setLogs.workoutId, recent.map((w) => w.id))))
    .orderBy(setLogs.setIndex)
    .all();
  return recent.map((w) => ({
    adjusted: w.loadFactor < 1,
    sets: rows.filter((r) => r.workoutId === w.id).map((r) => ({ reps: r.reps, loadKg: r.loadKg, seconds: r.seconds, rpe: r.rpe })),
  }));
}

export function finishWorkout(db: Db, workoutId: string, feel: number | null, at = nowIso()): void {
  db.update(workouts).set({ endedAt: at, feel }).where(eq(workouts.id, workoutId)).run();
}

export function workoutsInWeek(db: Db, season: number, week: number) {
  return db
    .select()
    .from(workouts)
    .where(and(eq(workouts.season, season), eq(workouts.week, week)))
    .orderBy(workouts.startedAt)
    .all();
}

/** The sets of the most recent workout that included this exercise: the base for the +1 rule. */
export function lastSetsForExercise(db: Db, exerciseId: string) {
  const last = db
    .select({ workoutId: setLogs.workoutId })
    .from(setLogs)
    .where(eq(setLogs.exerciseId, exerciseId))
    .orderBy(desc(setLogs.loggedAt))
    .get();
  if (!last) return [];
  return db
    .select()
    .from(setLogs)
    .where(and(eq(setLogs.workoutId, last.workoutId), eq(setLogs.exerciseId, exerciseId)))
    .orderBy(setLogs.setIndex)
    .all();
}

// ─── Markers, tests, check-ins ────────────────────────────────────────────

export function recordMarkers(db: Db, season: number, checkpoint: Checkpoint, values: Partial<Record<MarkerId, number>>): void {
  db.transaction((tx) => {
    for (const [marker, value] of Object.entries(values) as [MarkerId, number][]) {
      tx.insert(markerEntries)
        .values({ season, checkpoint, marker, value })
        .onConflictDoUpdate({ target: [markerEntries.season, markerEntries.checkpoint, markerEntries.marker], set: { value, recordedAt: nowIso() } })
        .run();
    }
  });
}

export function markersAt(db: Db, season: number, checkpoint: Checkpoint): Partial<Record<MarkerId, number>> {
  const rows = db
    .select()
    .from(markerEntries)
    .where(and(eq(markerEntries.season, season), eq(markerEntries.checkpoint, checkpoint)))
    .all();
  return Object.fromEntries(rows.map((r) => [r.marker, r.value]));
}

export function recordTest(db: Db, season: number, checkpoint: Checkpoint, test: TestId, value: number, note?: string): void {
  db.insert(testResults)
    .values({ season, checkpoint, test, value, note })
    .onConflictDoUpdate({ target: [testResults.season, testResults.checkpoint, testResults.test], set: { value, note, recordedAt: nowIso() } })
    .run();
}

export type CheckIn = { energy?: number; sleep?: number; mood?: number; win?: string; stuck?: string; adjust?: string };

export function saveCheckIn(db: Db, season: number, week: number, c: CheckIn): void {
  db.insert(checkIns)
    .values({ season, week, ...c })
    .onConflictDoUpdate({ target: [checkIns.season, checkIns.week], set: c })
    .run();
}

// ─── Data & privacy (screen 28) ────────────────────────────────────────────

/** "Export my data": everything, as one plain object the user can save or share herself. */
export function exportAll(db: Db) {
  return {
    exportedAt: nowIso(),
    profile: db.select().from(profile).all(),
    healthAnswers: db.select().from(healthAnswers).all(),
    seasons: db.select().from(seasons).all(),
    goals: db.select().from(goals).all(),
    workouts: db.select().from(workouts).all(),
    sets: db.select().from(setLogs).all(),
    markers: db.select().from(markerEntries).all(),
    tests: db.select().from(testResults).all(),
    checkIns: db.select().from(checkIns).all(),
    measurements: db.select().from(measurements).all(),
    // Photos are listed, not embedded: the files stay in the vault.
    photos: db.select({ id: vaultPhotos.id, checkpoint: vaultPhotos.checkpoint, pose: vaultPhotos.pose, takenAt: vaultPhotos.takenAt }).from(vaultPhotos).all(),
  };
}

/** "Erase all my data": every table emptied. Photo files must be deleted by the caller. */
export function eraseAll(db: Db): void {
  db.transaction((tx) => {
    for (const table of [setLogs, workouts, markerEntries, testResults, checkIns, goals, vaultPhotos, measurements, seasons, healthAnswers, profile]) {
      tx.delete(table).run();
    }
  });
}
