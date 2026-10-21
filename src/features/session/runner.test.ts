import { describe, expect, it } from '@jest/globals';

import { getSession } from '@/domain/programme';

import { toPlayable } from './playable';
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
