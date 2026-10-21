import { describe, expect, it } from '@jest/globals';

import { exercises } from '@/content/exercises';

import {
  allSessions,
  blockForWeek,
  blocks,
  circuitRoundsForWeek,
  formatTarget,
  getSession,
  prescriptionForWeek,
  sessionsForWeek,
  totalSets,
  weekRules,
  type StrengthExercise,
  type WeekNumber,
} from './index';

const libraryIds = new Set(exercises.map((e) => e.id));
const WEEKS = Array.from({ length: 12 }, (_, i) => (i + 1) as WeekNumber);

describe('programme content', () => {
  it('has three blocks of four weeks with three sessions each', () => {
    expect(blocks).toHaveLength(3);
    expect(blocks.flatMap((b) => b.weeks)).toEqual(WEEKS);
    expect(allSessions).toHaveLength(9);
    expect(new Set(allSessions.map((s) => s.id)).size).toBe(9);
  });

  it('gives every session a page in the programme chapter (pp. 26–37)', () => {
    for (const s of allSessions) {
      expect(s.page).toBeGreaterThanOrEqual(26);
      expect(s.page).toBeLessThanOrEqual(37);
    }
  });

  it('links every exercise to a real library card (or explicitly to none)', () => {
    for (const s of allSessions) {
      for (const e of s.exercises) {
        if (e.exerciseId !== null) expect(libraryIds).toContain(e.exerciseId);
      }
    }
  });

  it('has sane strength prescriptions', () => {
    for (const s of allSessions) {
      if (s.kind !== 'strength') continue;
      for (const e of s.exercises) {
        expect(e.sets).toBeGreaterThanOrEqual(2);
        expect(e.sets).toBeLessThanOrEqual(4);
        expect(e.rpe.min).toBeGreaterThanOrEqual(6);
        expect(e.rpe.max).toBeLessThanOrEqual(8); // RPE 10 has no place in this programme (p. 20)
        if (e.target.kind === 'reps') expect(e.target.min).toBeLessThanOrEqual(e.target.max);
      }
    }
  });

  it('only skips the rest on the first half of a superset', () => {
    for (const s of allSessions) {
      if (s.kind !== 'strength') continue;
      s.exercises.forEach((e, i) => {
        if (e.restSeconds === null) {
          expect(e.superset).toBeDefined();
          expect(s.exercises[i + 1]?.superset).toBe(e.superset);
        }
      });
    }
  });

  it('starts circuit C with the guide formats', () => {
    expect(getSession('b1-c')).toMatchObject({ format: { rounds: 3, workSeconds: 40, restSeconds: 20 } });
    expect(getSession('b2-c')).toMatchObject({ format: { rounds: 4, workSeconds: 45, restSeconds: 15 } });
    expect(getSession('b3-c')).toMatchObject({ format: { rounds: 5, workSeconds: 40, restSeconds: 20, betweenRoundsSeconds: 90 } });
  });
});

describe('week rules', () => {
  it('covers the 12 weeks in order, each in the right block', () => {
    expect(weekRules.map((r) => r.week)).toEqual(WEEKS);
    for (const r of weekRules) expect(blockForWeek(r.week).number).toBe(r.block);
  });

  it('deloads in weeks 4 and 8 with −30 %, tests in week 12 with −20 %', () => {
    expect(weekRules[3]).toMatchObject({ phase: 'deload', maxSets: 2, loadFactor: 0.7, review: 'day30' });
    expect(weekRules[7]).toMatchObject({ phase: 'deload', maxSets: 2, loadFactor: 0.7, review: 'day60' });
    expect(weekRules[11]).toMatchObject({ phase: 'test', loadFactor: 0.8, review: 'day90' });
  });

  it('caps sets at 2 and RPE at 6 in week 1', () => {
    const squat = getSession('b1-a')!.exercises[0] as StrengthExercise;
    expect(prescriptionForWeek(squat, 1)).toMatchObject({ sets: 2, rpe: { min: 6, max: 6 } });
    expect(prescriptionForWeek(squat, 2)).toMatchObject({ sets: 3, rpe: { min: 7, max: 7 } });
  });

  it('keeps 4-set lines at 4 in build weeks and 2 in the week 8 deload', () => {
    const squat = getSession('b2-a')!.exercises[0] as StrengthExercise;
    expect(prescriptionForWeek(squat, 6).sets).toBe(4);
    expect(prescriptionForWeek(squat, 8).sets).toBe(2);
  });

  it('cuts circuit rounds in weeks 8 and 12', () => {
    expect(circuitRoundsForWeek(getSession('b2-c')!, 7)).toBe(4);
    expect(circuitRoundsForWeek(getSession('b2-c')!, 8)).toBe(3);
    expect(circuitRoundsForWeek(getSession('b3-c')!, 12)).toBe(3);
    expect(circuitRoundsForWeek(getSession('b1-a')!, 1)).toBeNull();
  });

  it('serves the right sessions for a week', () => {
    expect(sessionsForWeek(3).map((s) => s.id)).toEqual(['b1-a', 'b1-b', 'b1-c']);
    expect(sessionsForWeek(9).map((s) => s.name)).toEqual(['Lower · Strength', 'Upper · Strength', 'Power']);
  });

  it('counts working sets', () => {
    expect(totalSets(getSession('b1-a')!, 1)).toBe(12); // 6 lines × 2 sets
    expect(totalSets(getSession('b1-c')!, 2)).toBe(18); // 3 rounds × 6 stations
  });
});

describe('formatTarget', () => {
  it('writes targets the way the guide does', () => {
    expect(formatTarget({ kind: 'reps', min: 10, max: 12 })).toBe('10–12');
    expect(formatTarget({ kind: 'reps', min: 8, max: 8, perSide: 'leg' })).toBe('8 / leg');
    expect(formatTarget({ kind: 'hold', minSeconds: 20, maxSeconds: 30 })).toBe('20–30 s');
    expect(formatTarget({ kind: 'maxMinus', minus: 2 })).toBe('max − 2');
  });
});
