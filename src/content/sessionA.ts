/**
 * Session A "Anchor", block 1 (Foundations), from the guide p. 27.
 * Temporary hand-typed copy so the guided session can run in milestone 1; milestone 2 replaces it
 * with the full typed seed of the programme. Loads are not prescribed by the guide (RPE-based).
 */
import type { PhotoKey } from './photos';

export type SessionExercise = {
  id: string;
  name: string;
  /** Accent word of the title (one key word per heading). */
  accent: string;
  sets: number;
  /** As written in the guide, e.g. "10–12", "8 / leg", "20–30 s". */
  reps: string;
  rpe: string;
  restSeconds: number;
  home: string;
  gym: string;
  muscles: string[];
  photo: PhotoKey;
  /** Coach cue shown during the set. Only where the mockups or the guide give one. */
  tip?: string;
  /** Cue shown on the rest card. */
  restCue?: string;
};

export type SessionTemplate = {
  id: string;
  letter: 'A' | 'B' | 'C';
  name: string;
  summary: string;
  minutes: number;
  photo: PhotoKey;
  exercises: SessionExercise[];
  coachNote: string;
};

export const sessionA: SessionTemplate = {
  id: 'a',
  letter: 'A',
  name: 'Anchor',
  summary: 'lower body & push',
  minutes: 35,
  photo: 'greySetStretch',
  coachNote:
    'This is the session where you learn the squat. On every descent: are my heels staying on the floor? Are my knees tracking outwards, in line with my feet? If not, go less deep rather than letting the position break down.',
  exercises: [
    {
      id: 'goblet-squat', name: 'Goblet squat', accent: 'squat', sets: 3, reps: '10–12', rpe: '6–7', restSeconds: 90,
      home: 'Bodyweight squat, or a loaded backpack hugged to the chest',
      gym: 'Goblet squat with a dumbbell or a kettlebell',
      muscles: ['Quads', 'Glutes', 'Core'], photo: 'kettlebellPink',
      tip: 'Heels stay on the floor, knees track out over your toes.',
    },
    {
      id: 'glute-bridge', name: 'Glute bridge', accent: 'bridge', sets: 3, reps: '12–15', rpe: '7', restSeconds: 75,
      home: 'On the floor, then shoulder blades on the sofa once that is too easy',
      gym: 'Hip thrust, back on a bench, bar or dumbbell across the hips',
      muscles: ['Glutes', 'Hamstrings'], photo: 'hipThrust',
    },
    {
      id: 'push-ups', name: 'Incline push-ups', accent: 'push-ups', sets: 3, reps: '8–10', rpe: '7', restSeconds: 90,
      home: 'Hands on the kitchen counter: the higher, the easier',
      gym: 'Dumbbell bench press, or chest press machine',
      muscles: ['Chest', 'Triceps', 'Shoulders'], photo: 'gymMirror',
    },
    {
      id: 'band-row', name: 'Band row', accent: 'row', sets: 3, reps: '12–15', rpe: '7', restSeconds: 75,
      home: 'Band looped around a table leg, seated with legs straight',
      gym: 'Seated cable row',
      muscles: ['Back', 'Biceps'], photo: 'dumbbellRow',
    },
    {
      id: 'reverse-lunge', name: 'Alternating reverse lunge', accent: 'reverse', sets: 2, reps: '8 / leg', rpe: '6–7', restSeconds: 60,
      home: 'Bodyweight, one hand on the wall if balance is short',
      gym: 'Light dumbbells by your sides',
      muscles: ['Quads', 'Glutes', 'Balance'], photo: 'reverseLunge',
      tip: 'Feel it in the front knee? Your step is too short. Lengthen it.',
      restCue: 'Breathe out as you push back up through the front heel.',
    },
    {
      id: 'plank', name: 'Plank', accent: 'Plank', sets: 3, reps: '20–30 s', rpe: '7', restSeconds: 45,
      home: 'On your forearms, pelvis tucked. Knees down if the lower back sags',
      gym: 'On your forearms, pelvis tucked. Knees down if the lower back sags',
      muscles: ['Core'], photo: 'seatedStretch',
    },
  ],
};

export const sessionsById: Record<string, SessionTemplate> = { a: sessionA };
