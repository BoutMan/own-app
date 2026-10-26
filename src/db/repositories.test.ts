import { describe, expect, it } from '@jest/globals';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import {
  activeSeason,
  activeSeason as activeSeasonOf,
  eraseAll,
  eraseCycle,
  exerciseHistory,
  getProfile,
  logPeriodStart,
  periodStarts,
  ritualsOn,
  saveOnboarding,
  seasonGoals,
  seasonMarkers,
  setRitual,
  updateProfile,
  exportAll,
  finishWorkout,
  lastSetsForExercise,
  logSet,
  markersAt,
  recordMarkers,
  saveCheckIn,
  startSeason,
  startWorkout,
  DEFAULT_WEEK_PLAN,
  loadProgress,
  savePhoto,
  removePhoto,
  seasonPhotos,
  testsAt,
  recordTest,
  saveBlockReview,
  blockReviewFor,
  setFeelings,
  feelingsOn,
  workoutsInWeek,
} from './repositories';
import { runMigrations } from './migrate';
import * as schema from './schema';
import type { Db } from './types';

function migrateSqlite(sqlite: Database.Database): string[] {
  return runMigrations({
    exec: (sql) => sqlite.exec(sql),
    appliedTags: () => (sqlite.prepare('SELECT tag FROM __own_migrations').all() as { tag: string }[]).map((r) => r.tag),
  });
}

/** A fresh in-memory database with the bundled migrations applied, as the app does. */
function testDb(): Db {
  const sqlite = new Database(':memory:');
  sqlite.pragma('foreign_keys = ON');
  migrateSqlite(sqlite);
  return drizzle(sqlite, { schema });
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

  it('builds the exercise history for the +1 rule, flagging reduced-load workouts', () => {
    const db = testDb();
    const season = startSeason(db, '2026-10-26');
    const a = startWorkout(db, { sessionId: 'b1-a', season, week: 2, mode: 'home' }, '2026-11-02T18:30:00Z');
    logSet(db, a, { stepKey: '1', exerciseId: 'goblet-squat', setIndex: 0, reps: 11, loadKg: 8 }, '2026-11-02T18:36:00Z');
    logSet(db, a, { stepKey: '1', exerciseId: 'goblet-squat', setIndex: 1, reps: 12, loadKg: 8 }, '2026-11-02T18:38:00Z');
    const b = startWorkout(db, { sessionId: 'b1-a', season, week: 4, mode: 'home', loadFactor: 0.7 }, '2026-11-16T18:30:00Z');
    logSet(db, b, { stepKey: '1', exerciseId: 'goblet-squat', setIndex: 0, reps: 10, loadKg: 5.5 }, '2026-11-16T18:36:00Z');
    const h = exerciseHistory(db, 'goblet-squat');
    expect(h).toHaveLength(2);
    expect(h[0]).toMatchObject({ adjusted: true, sets: [{ reps: 10, loadKg: 5.5 }] });
    expect(h[1]!.sets.map((s) => s.reps)).toEqual([11, 12]);
    expect(exerciseHistory(db, 'goblet-squat', 4, b)).toHaveLength(1);
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

  it('saves the whole onboarding in one go', () => {
    const db = testDb();
    const season = saveOnboarding(db, {
      firstName: 'Mia',
      feelings: ['Strong', 'Rested'],
      goals: [
        { slot: 'performance', text: '10 push-ups from my knees', baseline: '3' },
        { slot: 'sensation', text: '', baseline: null },
        { slot: 'free', text: 'My black jeans fit again', baseline: null },
      ],
      health: { pregnancyOrPostpartum: false, medicalCondition: false, injuryOrSurgery: false, noTrainingTwoYears: true, pelvicLeaking: true, pelvicHeaviness: false, pelvicUrgency: false },
      place: 'home',
      equipment: ['band', 'backpack'],
      markers: { energy: 4, sleep: 5 },
      weekPlan: ['rest', 'session', 'rest', 'session', 'rest', 'session', 'walk'],
      addToCalendar: true,
      remindNightBefore: false,
      startDate: '2026-10-26',
      signedAt: '2026-10-22T10:00:00Z',
    });
    expect(season).toBe(1);
    expect(getProfile(db)).toMatchObject({ firstName: 'Mia', groundedVersions: true, weekPlan: ['rest', 'session', 'rest', 'session', 'rest', 'session', 'walk'] });
    expect(seasonGoals(db, 1).map((g) => g.slot)).toEqual(['performance', 'free']);
    expect(seasonMarkers(db, 1)).toHaveLength(2);
    expect(activeSeasonOf(db)?.startDate).toBe('2026-10-26');
    updateProfile(db, { units: 'metric' });
    expect(getProfile(db)?.units).toBe('metric');
  });

  it('replaces an untrained season when onboarding is done again, keeps a trained one', () => {
    const db = testDb();
    const record = (startDate: string) => ({
      firstName: null, feelings: [], goals: [{ slot: 'performance' as const, text: 'Ten push-ups', baseline: null }],
      health: { pregnancyOrPostpartum: false, medicalCondition: false, injuryOrSurgery: false, noTrainingTwoYears: false, pelvicLeaking: false, pelvicHeaviness: false, pelvicUrgency: false },
      place: 'home' as const, equipment: [], markers: { energy: 5 }, weekPlan: [...DEFAULT_WEEK_PLAN], addToCalendar: true, remindNightBefore: true,
      startDate, signedAt: '2026-10-22T10:00:00Z',
    });
    expect(saveOnboarding(db, record('2026-10-26'))).toBe(1);
    expect(saveOnboarding(db, record('2026-11-02'))).toBe(1);
    expect(seasonGoals(db, 1)).toHaveLength(1);
    expect(activeSeasonOf(db)?.startDate).toBe('2026-11-02');
    startWorkout(db, { sessionId: 'b1-a', season: 1, week: 1, mode: 'home' });
    expect(saveOnboarding(db, record('2027-01-25'))).toBe(2);
  });

  it('measures load gained per exercise on full-load workouts only', () => {
    const db = testDb();
    startSeason(db, '2026-10-05');
    const at = (d: string, factor = 1) => startWorkout(db, { sessionId: 'b1-a', season: 1, week: 1, mode: 'home', loadFactor: factor }, `2026-10-${d}T18:00:00Z`);
    const w1 = at('05');
    logSet(db, w1, { stepKey: '1', exerciseId: 'goblet-squat', setIndex: 0, reps: 10, loadKg: 8 });
    logSet(db, w1, { stepKey: '1', exerciseId: 'goblet-squat', setIndex: 1, reps: 10, loadKg: 9 });
    const w2 = at('12', 0.7);
    logSet(db, w2, { stepKey: '1', exerciseId: 'goblet-squat', setIndex: 0, reps: 10, loadKg: 20 });
    const w3 = at('19');
    logSet(db, w3, { stepKey: '1', exerciseId: 'goblet-squat', setIndex: 0, reps: 10, loadKg: 11 });
    logSet(db, w3, { stepKey: '2', exerciseId: 'romanian-deadlift', setIndex: 0, reps: 10, loadKg: 12 });
    expect(loadProgress(db, 1)).toEqual([
      { exerciseId: 'goblet-squat', fromKg: 9, toKg: 11 },
      { exerciseId: 'romanian-deadlift', fromKg: 12, toKg: 12 },
    ]);
  });

  it('stores tests, block reviews and daily feelings', () => {
    const db = testDb();
    startSeason(db, '2026-10-05');
    recordTest(db, 1, 'day0', 'pushUps', 3, 'knees');
    recordTest(db, 1, 'day30', 'pushUps', 7, 'knees');
    recordTest(db, 1, 'day30', 'pushUps', 8, 'floor');
    expect(testsAt(db, 1, 'day30')).toEqual({ pushUps: { value: 8, note: 'floor' } });
    saveBlockReview(db, 1, 'day30', { changedMost: 'Sleep', oneChange: null });
    saveBlockReview(db, 1, 'day30', { changedMost: 'Sleep', oneChange: 'Clothes out' });
    expect(blockReviewFor(db, 1, 'day30')).toMatchObject({ changedMost: 'Sleep', oneChange: 'Clothes out' });
    setFeelings(db, '2026-10-22', ['energy']);
    setFeelings(db, '2026-10-22', ['cramps', 'bloated']);
    expect(feelingsOn(db, '2026-10-22')).toEqual(['cramps', 'bloated']);
    setFeelings(db, '2026-10-22', []);
    expect(feelingsOn(db, '2026-10-22')).toEqual([]);
  });

  it('keeps one vault photo per checkpoint and pose, handing back replaced files', () => {
    const db = testDb();
    startSeason(db, '2026-10-05');
    expect(savePhoto(db, 1, 'day0', 'front', 'file:///vault/a.jpg')).toBeNull();
    expect(savePhoto(db, 1, 'day0', 'front', 'file:///vault/b.jpg')).toBe('file:///vault/a.jpg');
    savePhoto(db, 1, 'day0', 'side', 'file:///vault/c.jpg');
    expect(seasonPhotos(db, 1).map((p) => p.fileUri)).toEqual(['file:///vault/b.jpg', 'file:///vault/c.jpg']);
    expect(removePhoto(db, seasonPhotos(db, 1)[0]!.id)).toBe('file:///vault/b.jpg');
    expect(seasonPhotos(db, 1)).toHaveLength(1);
  });

  it('keeps one value per ritual and day', () => {
    const db = testDb();
    setRitual(db, '2026-10-22', 'water', 0.5);
    setRitual(db, '2026-10-22', 'water', 1);
    setRitual(db, '2026-10-22', 'protein', 2);
    expect(ritualsOn(db, '2026-10-22')).toEqual({ water: 1, protein: 2 });
    expect(ritualsOn(db, '2026-10-23')).toEqual({});
  });

  it('logs periods once per day and erases the cycle with tracking off', () => {
    const db = testDb();
    updateProfile(db, { cycleTracking: true });
    logPeriodStart(db, '2026-10-14');
    logPeriodStart(db, '2026-10-14');
    logPeriodStart(db, '2026-09-16');
    expect(periodStarts(db)).toEqual(['2026-09-16', '2026-10-14']);
    eraseCycle(db);
    expect(periodStarts(db)).toEqual([]);
    expect(getProfile(db)?.cycleTracking).toBe(false);
  });

  it('never mixes circuit rounds with strength sets in the history', () => {
    const db = testDb();
    const season = startSeason(db, '2026-10-26');
    const c = startWorkout(db, { sessionId: 'b1-c', season, week: 1, mode: 'home' }, '2026-10-30T18:00:00Z');
    logSet(db, c, { stepKey: '1', exerciseId: 'goblet-squat', setIndex: 0, reps: 22 }, '2026-10-30T18:05:00Z');
    const a = startWorkout(db, { sessionId: 'b1-a', season, week: 1, mode: 'home' }, '2026-10-26T18:00:00Z');
    logSet(db, a, { stepKey: '1', exerciseId: 'goblet-squat', setIndex: 0, reps: 10, loadKg: 8 }, '2026-10-26T18:05:00Z');
    expect(exerciseHistory(db, 'goblet-squat')[0]!.sets[0]!.reps).toBe(10);
    expect(exerciseHistory(db, 'goblet-squat', 4, undefined, 'circuit')[0]!.sets[0]!.reps).toBe(22);
  });
});
