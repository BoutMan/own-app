/** The seven markers (p. 13) and the five baseline tests (p. 14), repeated on day 30, 60 and 90. */
import type { MarkerId, TestId } from './types';

export const markers: readonly { id: MarkerId; label: string; guideLabel: string }[] = [
  { id: 'energy', label: 'Morning energy', guideLabel: 'Morning energy' },
  { id: 'sleep', label: 'Sleep', guideLabel: 'Sleep quality' },
  { id: 'strength', label: 'Strength', guideLabel: 'Feeling of strength' },
  { id: 'breath', label: 'Breath', guideLabel: 'Breath & recovery' },
  { id: 'posture', label: 'Posture & back', guideLabel: 'Posture & back' },
  { id: 'mood', label: 'Mood', guideLabel: 'Mood & stress' },
  { id: 'confidence', label: 'Confidence', guideLabel: 'Self-confidence' },
];

export type TestUnit = 'reps' | 'seconds' | 'minutes';

export const baselineTests: readonly { id: TestId; label: string; how: string; unit: TestUnit }[] = [
  { id: 'pushUps', label: 'Push-ups in a row', how: 'Hands on the edge of a table: note the height too', unit: 'reps' },
  { id: 'plank', label: 'Plank hold', how: 'In seconds', unit: 'seconds' },
  { id: 'squats60', label: 'Bodyweight squats', how: 'In 60 seconds', unit: 'reps' },
  { id: 'wallSit', label: 'Wall sit', how: 'In seconds', unit: 'seconds' },
  { id: 'walk', label: 'Brisk walk', how: 'Minutes without stopping', unit: 'minutes' },
];

/** Checkpoints at which markers and tests are taken (day 0, then the end of each block). */
export const checkpoints = ['day0', 'day30', 'day60', 'day90'] as const;
export type Checkpoint = (typeof checkpoints)[number];

export const baselinePages = { markers: 13, tests: 14 } as const;
