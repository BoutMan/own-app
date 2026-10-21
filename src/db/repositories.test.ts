import { describe, expect, it } from '@jest/globals';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import path from 'node:path';

import {
  activeSeason,
  eraseAll,
  exportAll,
  finishWorkout,
  lastSetsForExercise,
  logSet,
  markersAt,
  recordMarkers,
  saveCheckIn,
  startSeason,
  startWorkout,
  workoutsInWeek,
} from './repositories';
import * as schema from './schema';
import type { Db } from './types';

/** A fresh in-memory database with the real migrations applied. */
function testDb(): Db {
  const sqlite = new Database(':memory:');
  sqlite.pragma('foreign_keys = ON');
  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: path.join(__dirname, '../../drizzle') });
  return db;
}

describe('on-device database', () => {
  it('bundles the SQL migrations the app runs on the device', () => {
    const bundled = require('../../drizzle/migrations') as { default: { migrations: Record<string, string> } };
    expect(bundled.default.migrations.m0000).toContain('CREATE TABLE `workouts`');
  });

  it('applies the migrations and starts seasons in sequence', () => {
    const db = testDb();
    expect(startSeason(db, '2026-10-26')).toBe(1);
    expect(startSeason(db, '2027-01-18')).toBe(2);
    expect(activeSeason(db)?.number).toBe(2);
  });

  it('logs a workout and returns the last sets of an exercise for the +1 rule', () => {
    const db = testDb();
    const season = startSeason(db, '2026-10-26');
    const w1 = startWorkout(db, { sessionId: 'b1-a', season, week: 2, mode: 'home' }, '2026-11-02T18:30:00Z');
    logSet(db, w1, { stepKey: '1', exerciseId: 'goblet-squat', setIndex: 0, reps: 11, loadKg: 8 }, '2026-11-02T18:36:00Z');
    logSet(db, w1, { stepKey: '1', exerciseId: 'goblet-squat', setIndex: 1, reps: 10, loadKg: 8 }, '2026-11-02T18:38:00Z');
    finishWorkout(db, w1, 7, '2026-11-02T19:05:00Z');

    const w2 = startWorkout(db, { sessionId: 'b1-a', season, week: 3, mode: 'home' }, '2026-11-09T18:30:00Z');
    logSet(db, w2, { stepKey: '1', exerciseId: 'goblet-squat', setIndex: 0, reps: 12, loadKg: 8 }, '2026-11-09T18:36:00Z');

    expect(lastSetsForExercise(db, 'goblet-squat').map((s) => s.reps)).toEqual([12]);
    expect(lastSetsForExercise(db, 'plank')).toEqual([]);
    expect(workoutsInWeek(db, season, 2)).toHaveLength(1);
    expect(workoutsInWeek(db, season, 2)[0]).toMatchObject({ feel: 7, endedAt: '2026-11-02T19:05:00Z' });
  });

  it('rejects impossible values', () => {
    const db = testDb();
    const season = startSeason(db, '2026-10-26');
    expect(() => startWorkout(db, { sessionId: 'b1-a', season, week: 13, mode: 'gym' })).toThrow();
    expect(() => recordMarkers(db, season, 'day0', { sleep: 11 })).toThrow();
    expect(() => startWorkout(db, { sessionId: 'b1-a', season: 99, week: 1, mode: 'gym' })).toThrow(); // unknown season
  });

  it('stores markers once per checkpoint, updating on a second answer', () => {
    const db = testDb();
    const season = startSeason(db, '2026-10-26');
    recordMarkers(db, season, 'day0', { energy: 4, sleep: 5 });
    recordMarkers(db, season, 'day0', { sleep: 6 });
    expect(markersAt(db, season, 'day0')).toEqual({ energy: 4, sleep: 6 });
  });

  it('upserts the Sunday check-in of a week', () => {
    const db = testDb();
    const season = startSeason(db, '2026-10-26');
    saveCheckIn(db, season, 3, { energy: 7, win: 'First goblet squat at 18 lb' });
    saveCheckIn(db, season, 3, { energy: 8 });
    const data = exportAll(db);
    expect(data.checkIns).toHaveLength(1);
    expect(data.checkIns[0]).toMatchObject({ energy: 8, win: 'First goblet squat at 18 lb' });
  });

  it('erases everything, including cascaded sets', () => {
    const db = testDb();
    const season = startSeason(db, '2026-10-26');
    const w = startWorkout(db, { sessionId: 'b1-b', season, week: 1, mode: 'home' });
    logSet(db, w, { stepKey: '1', exerciseId: 'romanian-deadlift', setIndex: 0, reps: 10 });
    eraseAll(db);
    const data = exportAll(db);
    expect([data.seasons, data.workouts, data.sets, data.markers].every((t) => t.length === 0)).toBe(true);
  });
});
