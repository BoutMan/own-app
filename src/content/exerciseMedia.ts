import type { ExerciseFamily } from './exercises';
import type { PhotoKey } from './photos';

/** Placeholder photos until the exercise videos are shot (about 80, see CLAUDE.md). */
const byExercise: Record<string, PhotoKey> = {
  'goblet-squat': 'kettlebellPink',
  'romanian-deadlift': 'backFlexRed',
  'glute-bridge': 'hipThrust',
  'reverse-lunge': 'reverseLunge',
  'single-arm-row': 'dumbbellRow',
  'band-row': 'dumbbellRow',
  'lat-pulldown': 'gymMachineSelfie',
  'push-ups': 'gymMirror',
  'brisk-walk-in-zone-2': 'treadmill',
  plank: 'seatedStretch',
  'single-leg-glute-bridge': 'hipThrust',
};

const byFamily: Record<ExerciseFamily, PhotoKey> = {
  lower: 'kettlebellPink2',
  upper: 'gymMachineSelfie',
  core: 'seatedStretch',
  circuit: 'trackStretch',
  prevention: 'greySetStretch',
};

export function exercisePhoto(id: string, family: ExerciseFamily): PhotoKey {
  return byExercise[id] ?? byFamily[family];
}

export const familyLabels: Record<ExerciseFamily, { label: string; short: string; tone: 'mauve' | 'fog' | 'latte' | 'vanilla' | 'mocha' }> = {
  lower: { label: 'Lower body', short: 'Lower', tone: 'mauve' },
  upper: { label: 'Upper body', short: 'Upper', tone: 'fog' },
  core: { label: 'Core', short: 'Core', tone: 'latte' },
  circuit: { label: 'Circuit', short: 'Circuit', tone: 'vanilla' },
  prevention: { label: 'Prevention', short: 'Prevention', tone: 'mocha' },
};
