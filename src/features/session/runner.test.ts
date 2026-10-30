import { describe, expect, it } from '@jest/globals';

import { getSession } from '@/domain/programme';

import { applyVariant, toPlayable } from './playable';
import { logSet, restLeft, skipRest, startRunner, totalToLog, type RunnerState } from './runner';

function runToEnd(id: string, week: 1 | 2 | 3 | 8) {
  const session = toPlayable(getSession(id)!, week);
  let s: RunnerState = startRunner(session, 0);
  const visited: string[] = [];
  let logs = 0;
  while (!s.finished && logs < 200) {
    visited.push(`${session.steps[s.stepIndex]!.key}#${s.setIndex}`);
    s = skipRest(logSet(session, s, logs * 1000));
    logs++;
  }
  return { session, s, visited, logs };
}

describe('guided session runner', () => {
  it('plays session A of week 1 with 2 sets per line (week rule)', () => {
    const { logs, session } = runToEnd('b1-a', 1);
    expect(totalToLog(session)).toBe(12);
    expect(logs).toBe(12);
  });

  it('does all sets of a strength step before moving on', () => {
    const { visited } = runToEnd('b1-a', 2);
    expect(visited.slice(0, 4)).toEqual(['1#0', '1#1', '1#2', '2#0']);
  });

  it('turns a superset into one step and rests only after both moves', () => {
    const session = toPlayable(getSession('b2-a')!, 5);
    const pair = session.steps.find((st) => st.key === '6·A1+6·A2')!;
    expect(pair.name).toBe('Banded leg curl + Standing calf raise on a step');
    expect(pair.restSeconds).toBe(45);
    expect(pair.target).toBe('12 + 15');
    expect(pair.parts.map((p) => p.exerciseId)).toEqual(['banded-leg-curl', 'standing-calf-raise']);
    expect(pair.parts.every((p) => p.history === 'strength' && p.loadable)).toBe(true);
  });

  it('logs reps per circuit station, apart from strength history', () => {
    const station = toPlayable(getSession('b1-c')!, 2).steps[0]!;
    expect(station.parts).toHaveLength(1);
    expect(station.parts[0]).toMatchObject({ exerciseId: 'goblet-squat', history: 'circuit', loadable: false });
  });

  it('plays circuits station by station, round after round', () => {
    const { visited, logs } = runToEnd('b1-c', 2);
    expect(logs).toBe(18); // 3 rounds × 6 stations
    expect(visited.slice(0, 7)).toEqual(['1#0', '2#0', '3#0', '4#0', '5#0', '6#0', '1#1']);
  });

  it('cuts block 2 circuit to three rounds in the week 8 deload', () => {
    expect(runToEnd('b2-c', 8).logs).toBe(18);
    expect(runToEnd('b2-c', 3).logs).toBe(24);
  });

  it('rests for the prescribed time, longer between circuit rounds', () => {
    const strength = toPlayable(getSession('b1-a')!, 2);
    const s1 = logSet(strength, startRunner(strength, 0), 0);
    expect(restLeft(s1, 0)).toBe(90);
    expect(restLeft(s1, 30_500)).toBe(60);

    const circuit = toPlayable(getSession('b1-c')!, 2);
    let s = startRunner(circuit, 0);
    for (let i = 0; i < 5; i++) s = logSet(circuit, s, 0);
    expect(restLeft(s, 0)).toBe(20); // between stations
    s = logSet(circuit, s, 0);
    expect(restLeft(s, 0)).toBe(60); // between rounds
  });
});

describe('bare minimum (guide p. 53)', () => {
  it('plays 3 rounds of four moves, no rest between moves, 1 minute between rounds', () => {
    const v = applyVariant(toPlayable(getSession('b2-a')!, 6), 'tenMin');
    expect(v.session.id).toBe('b2-a');
    expect(v.session.steps.map((st) => st.target)).toEqual(['15 reps', '10 reps', '15 reps', '30 s']);
    let s = startRunner(v.session, 0);
    s = logSet(v.session, s, 0);
    expect(s.restEndsAt).toBeNull();
    for (let i = 0; i < 3; i++) s = logSet(v.session, s, 0);
    expect([s.setIndex, s.restTotal]).toEqual([1, 60]);
    for (let i = 0; i < 8; i++) s = logSet(v.session, skipRest(s), 0);
    expect(s.finished).toBe(true);
  });
});

