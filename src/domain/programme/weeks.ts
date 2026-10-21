/**
 * Week-by-week rules, p. 23 ("Week by week in detail") and the block pages 26, 30, 33, 34, 37.
 * Only what the guide states is encoded; open questions are listed in docs/programme-notes.md.
 */
import type { WeekRule } from './types';

export const weekRules: readonly WeekRule[] = [
  { week: 1, block: 1, phase: 'learn', maxSets: 2, rpe: { min: 6, max: 6 }, page: 23,
    note: "Getting the hang of it. Only 2 sets per exercise, RPE 6. You should finish thinking “I could have done more”. That's deliberate." },
  { week: 2, block: 1, phase: 'build', rpe: { min: 7, max: 7 }, page: 23,
    note: 'The load goes up as soon as you reach the top of the rep range.' },
  { week: 3, block: 1, phase: 'build', rpe: { min: 7, max: 7 }, page: 23,
    note: 'The load goes up as soon as you reach the top of the rep range.' },
  { week: 4, block: 1, phase: 'deload', maxSets: 2, loadFactor: 0.7, review: 'day30', page: 23,
    note: 'Same sessions, 2 sets, loads cut by 30 %. You recover, and that is when the body consolidates.' },
  { week: 5, block: 2, phase: 'build', page: 23, note: 'Upper / lower split. The highest volume of the programme.' },
  { week: 6, block: 2, phase: 'build', page: 23, note: 'The most demanding stretch. Weeks 6 and 7 are the real test.' },
  { week: 7, block: 2, phase: 'build', page: 23, note: 'The most demanding stretch. Weeks 6 and 7 are the real test.' },
  { week: 8, block: 2, phase: 'deload', maxSets: 2, loadFactor: 0.7, circuitRounds: 3, zone2Minutes: 15, review: 'day60', page: 33,
    note: 'Second wind: 2 sets at −30 %. Session C: three rounds instead of four, and 15 minutes of zone 2. Day 60 review at the end of the week.' },
  { week: 9, block: 3, phase: 'build', page: 23, note: 'The heaviest loads, lower reps, a finisher.' },
  { week: 10, block: 3, phase: 'build', page: 23, note: 'The heaviest loads, lower reps, a finisher.' },
  { week: 11, block: 3, phase: 'build', page: 23, note: 'The heaviest loads, lower reps, a finisher.' },
  { week: 12, block: 3, phase: 'test', loadFactor: 0.8, circuitRounds: 3, review: 'day90', page: 34,
    note: 'The last three sessions are done with the load cut by 20 %, then you redo the five day 0 tests and compare. Then you celebrate.' },
];
