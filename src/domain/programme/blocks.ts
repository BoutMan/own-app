/**
 * The three blocks and nine sessions of the guide, pp. 23 and 26–37, transcribed line by line.
 * Wording is the guide's; only French leftovers are translated ("Planche" → Plank, "Pompes" → Push-ups).
 * Gym/home versions: the guide prints home first and gym below.
 */
import type { Block, CircuitSession, StrengthSession } from './types';

const reps = (min: number, max = min, perSide?: 'leg' | 'arm' | 'side') =>
  ({ kind: 'reps', min, max, ...(perSide ? { perSide } : {}) }) as const;
const hold = (minSeconds: number, maxSeconds = minSeconds) => ({ kind: 'hold', minSeconds, maxSeconds }) as const;
const rpe = (min: number, max = min) => ({ min, max });

// ─── Block 1 · Foundations · weeks 1–4 ────────────────────────────────────────────────

const b1a: StrengthSession = {
  id: 'b1-a', block: 1, letter: 'A', kind: 'strength', name: 'Anchor', focus: 'lower body & push', minutes: 35, warmUp: true, page: 27,
  exercises: [
    { slot: '1', name: 'Goblet squat', exerciseId: 'goblet-squat', sets: 3, target: reps(10, 12), rpe: rpe(6, 7), restSeconds: 90,
      home: 'Bodyweight squat, or a loaded backpack hugged to the chest', gym: 'Goblet squat with a dumbbell or a kettlebell' },
    { slot: '2', name: 'Glute bridge', exerciseId: 'glute-bridge', sets: 3, target: reps(12, 15), rpe: rpe(7), restSeconds: 75,
      home: "On the floor, then shoulder blades on the sofa once that's too easy", gym: 'Hip thrust, back on a bench, bar or dumbbell across the hips' },
    { slot: '3', name: 'Incline push-ups', exerciseId: 'push-ups', sets: 3, target: reps(8, 10), rpe: rpe(7), restSeconds: 90,
      home: 'Hands on the kitchen counter: the higher, the easier', gym: 'Dumbbell bench press, or chest press machine' },
    { slot: '4', name: 'Band row', exerciseId: 'band-row', sets: 3, target: reps(12, 15), rpe: rpe(7), restSeconds: 75,
      home: 'Band looped around a table leg, seated with legs straight', gym: 'Seated cable row' },
    { slot: '5', name: 'Alternating reverse lunge', exerciseId: 'reverse-lunge', sets: 2, target: reps(8, 8, 'leg'), rpe: rpe(6, 7), restSeconds: 60,
      home: 'Bodyweight, one hand on the wall if balance is short', gym: 'Light dumbbells by your sides' },
    { slot: '6', name: 'Plank', exerciseId: 'plank', sets: 3, target: hold(20, 30), rpe: rpe(7), restSeconds: 45,
      note: 'On your forearms, pelvis tucked. Knees down if the lower back sags' },
  ],
  finisher: { optional: true, text: '10 minutes of brisk walking, outside if possible. The aim is to bring the heart rate down while moving, not to exhaust yourself.' },
  coachNote:
    'This is the session where you learn the squat, and the squat underpins everything else in the programme. On every descent, ask yourself two questions: are my heels staying on the floor? Are my knees tracking outwards, in line with my feet? If the answer is no to either, reduce the range rather than letting the position break down. The range will come on its own within three weeks.',
};

const b1b: StrengthSession = {
  id: 'b1-b', block: 1, letter: 'B', kind: 'strength', name: 'Hinge', focus: 'posterior chain & pull', minutes: 35, warmUp: true, page: 28,
  exercises: [
    { slot: '1', name: 'Romanian deadlift', exerciseId: 'romanian-deadlift', sets: 3, target: reps(10, 12), rpe: rpe(7), restSeconds: 90,
      home: 'A loaded backpack held in both hands, or two 1.5 L bottles', gym: 'Dumbbells or a bar, legs almost straight' },
    // No library card for the plain split squat; the closest card is the Bulgarian split squat.
    { slot: '2', name: 'Split squat', exerciseId: null, sets: 2, target: reps(8, 8, 'leg'), rpe: rpe(7), restSeconds: 75,
      home: 'A long step forward, lowering on the spot', gym: 'Dumbbell split squat' },
    { slot: '3', name: 'Band lat pulldown', exerciseId: 'lat-pulldown', sets: 3, target: reps(12), rpe: rpe(7), restSeconds: 75,
      home: 'Band wedged at the top of a door, kneeling', gym: 'Cable pulldown' },
    { slot: '4', name: 'Shoulder press', exerciseId: 'shoulder-press', sets: 3, target: reps(10), rpe: rpe(7), restSeconds: 75,
      home: 'Two water bottles or a backpack', gym: 'Seated dumbbells, backrest at 85°' },
    { slot: '5', name: 'Dead bug', exerciseId: 'dead-bug', sets: 3, target: reps(8, 8, 'side'), rpe: rpe(6), restSeconds: 45,
      note: 'Lying down, lower back pressed to the floor, opposite arm and leg reaching away slowly' },
    { slot: '6', name: 'Superman', exerciseId: 'superman', sets: 2, target: reps(12), rpe: rpe(6), restSeconds: 45,
      note: 'Face down, lift chest and legs, 2 seconds at the top' },
  ],
  finisher: { optional: true, text: '3 × 30 seconds of side plank per side, 30 seconds of rest between each.' },
  coachNote:
    "The Romanian deadlift is the most useful and the most badly performed movement in the programme. It is not a back movement: it's a hip movement. Push your hips back toward an imaginary wall behind you, back flat, the load brushing your thighs. You should feel the back of your thighs stretch, never your lower back pulling. If an exercise feels easy two sessions in a row, increase the load next time.",
};

const b1c: CircuitSession = {
  id: 'b1-c', block: 1, letter: 'C', kind: 'circuit', name: 'Full circuit', focus: 'strength & cardio', minutes: 30, warmUp: true, page: 29,
  format: { rounds: 3, workSeconds: 40, restSeconds: 20, betweenRoundsSeconds: 60 },
  exercises: [
    { slot: '1', name: 'Bodyweight squat', exerciseId: 'goblet-squat', watch: 'Steady rhythm, no bouncing at the bottom', gym: 'Light goblet squat', rpe: rpe(7) },
    { slot: '2', name: 'Incline push-ups', exerciseId: 'push-ups', watch: 'Elbows at 45°, not flared out wide', home: 'Hand height set so you can hold the 40 s', rpe: rpe(7) },
    { slot: '3', name: 'Band row', exerciseId: 'band-row', watch: 'Shoulder blades squeezing, shoulders down', gym: 'Low cable row', rpe: rpe(7) },
    { slot: '4', name: 'Step-up onto a step', exerciseId: 'step-up', watch: 'Push with the top leg, no swinging', home: 'Alternating, on a stair or a stable bench', rpe: rpe(7) },
    { slot: '5', name: 'Glute bridge', exerciseId: 'glute-bridge', watch: 'Squeeze the glutes, ribs down', home: 'One-second pause at the top of every rep', rpe: rpe(7) },
    { slot: '6', name: 'Side plank', exerciseId: 'side-plank', watch: 'Hips high, body in line from head to feet', home: '20 seconds on each side', rpe: rpe(7) },
  ],
  finisher: { optional: false, text: '15 minutes of brisk walking: this is your cardio session for the week if you do no other.' },
  coachNote:
    "In a circuit, the temptation is to rush to get more done. 40 seconds of clean movement beats 40 seconds of flailing. If you can't hold the 40 seconds, stop, breathe, start again: that's normal for the first two weeks. If you only have 15 minutes: two rounds instead of three, and no walk.",
};

// ─── Block 2 · Building · weeks 5–8 ──────────────────────────────────────────────────

const b2a: StrengthSession = {
  id: 'b2-a', block: 2, letter: 'A', kind: 'strength', name: 'Lower body', focus: 'legs & glutes', minutes: 45, warmUp: true, page: 31,
  exercises: [
    { slot: '1', name: 'Goblet squat', exerciseId: 'goblet-squat', sets: 4, target: reps(8, 10), rpe: rpe(7, 8), restSeconds: 120,
      home: 'Loaded backpack, or a dumbbell if you have one', gym: 'Barbell squat or heavy goblet' },
    { slot: '2', name: 'Romanian deadlift', exerciseId: 'romanian-deadlift', sets: 3, target: reps(10, 12), rpe: rpe(8), restSeconds: 90,
      home: 'Backpack held in both hands', gym: 'Dumbbells or a bar' },
    { slot: '3', name: 'Bulgarian split squat', exerciseId: 'bulgarian-split-squat', sets: 3, target: reps(8, 8, 'leg'), rpe: rpe(7, 8), restSeconds: 90,
      home: 'Bodyweight', gym: 'Dumbbells', note: 'Back foot on a chair or a bench' },
    { slot: '4', name: 'Glute bridge, 2 s pause at the top', exerciseId: 'glute-bridge', sets: 3, target: reps(12), rpe: rpe(8), restSeconds: 75,
      home: 'Shoulder blades on the sofa, load on the hips', gym: 'Barbell hip thrust' },
    { slot: '5', name: 'Banded hip abduction', exerciseId: 'banded-hip-abduction', sets: 3, target: reps(20), rpe: rpe(7), restSeconds: 45,
      note: 'Band above the knees, seated or lying on your side' },
    { slot: '6·A1', name: 'Banded leg curl', exerciseId: 'banded-leg-curl', sets: 3, target: reps(12), rpe: rpe(7), restSeconds: null, superset: 'A',
      note: 'Face down, band around the ankles anchored in front: bend the knees' },
    { slot: '6·A2', name: 'Standing calf raise on a step', exerciseId: 'standing-calf-raise', sets: 3, target: reps(15), rpe: rpe(7), restSeconds: 45, superset: 'A',
      note: 'Full range, 1 second pause at the top and the bottom' },
  ],
  finisher: { optional: false, text: 'Wall sit: 3 × as long as you can hold, 60 seconds of rest between each. Write your times down, they climb fast.' },
  coachNote:
    'The Bulgarian split squat is the highest-yield exercise in this session and the most hated. It corrects the imbalances between your two legs, hits the glutes enormously, and needs no equipment. Start by resting only the toes of the back foot on the chair, torso leaning slightly forward. If balance is short, keep a finger on a wall: it takes nothing away from the work.',
};

const b2b: StrengthSession = {
  id: 'b2-b', block: 2, letter: 'B', kind: 'strength', name: 'Upper body', focus: 'back, shoulders, chest & arms', minutes: 45, warmUp: true, page: 32,
  exercises: [
    { slot: '1', name: 'Push-ups', exerciseId: 'push-ups', sets: 4, target: { kind: 'maxMinus', minus: 2 }, rpe: rpe(8), restSeconds: 90,
      note: 'Progression: incline → knees down → feet down. Drop back a level as soon as form breaks down' },
    { slot: '2', name: 'Single-arm row', exerciseId: 'single-arm-row', sets: 4, target: reps(10, 10, 'arm'), rpe: rpe(8), restSeconds: 90,
      home: 'Loaded bag, knee and hand resting on a chair', gym: 'Dumbbell or cable' },
    { slot: '3', name: 'Shoulder press', exerciseId: 'shoulder-press', sets: 3, target: reps(10), rpe: rpe(8), restSeconds: 75,
      home: 'Bottles or a backpack', gym: 'Seated dumbbells' },
    { slot: '4', name: 'Lat pulldown', exerciseId: 'lat-pulldown', sets: 3, target: reps(10, 12), rpe: rpe(8), restSeconds: 75,
      home: 'Band anchored at the top of a door', gym: 'Cable pulldown or assisted pull-up' },
    { slot: '5·A1', name: 'Lateral raises', exerciseId: 'lateral-raises', sets: 3, target: reps(12, 15), rpe: rpe(7), restSeconds: null, superset: 'A',
      note: 'Straight into A2 with no rest, then rest. Bottles or light dumbbells' },
    { slot: '5·A2', name: 'Biceps curl', exerciseId: 'biceps-curl', sets: 3, target: reps(12), rpe: rpe(7), restSeconds: 60, superset: 'A',
      note: 'Elbows tight to the body, no swinging from the back' },
    { slot: '6·B1', name: 'Overhead triceps extension', exerciseId: 'overhead-triceps-extension', sets: 3, target: reps(12), rpe: rpe(7), restSeconds: null, superset: 'B',
      note: 'A bottle or a dumbbell held in both hands, elbows in' },
    { slot: '6·B2', name: 'Banded external rotation', exerciseId: 'banded-external-rotation', sets: 2, target: reps(15, 15, 'arm'), rpe: rpe(6), restSeconds: 60, superset: 'B',
      note: 'Elbow tight to the body, forearm rotating outwards. Protects the shoulder' },
  ],
  finisher: { optional: false, text: 'Plank: 3 × 40 seconds, 30 seconds of rest.' },
  coachNote:
    "The upper-body session is the one women skip most often, and that's a mistake: it's the one that straightens your posture and shapes your shoulders. On the row, think “elbow toward the hip” rather than “pull with the arm”.",
};

const b2c: CircuitSession = {
  id: 'b2-c', block: 2, letter: 'C', kind: 'circuit', name: 'Full body & cardio', focus: 'circuit + zone 2', minutes: 40, warmUp: true, page: 33,
  format: { rounds: 4, workSeconds: 45, restSeconds: 15, betweenRoundsSeconds: 60 },
  exercises: [
    { slot: '1', name: 'Jump squat', exerciseId: 'jump-squat', gentler: 'Fast squat without leaving the floor' },
    { slot: '2', name: 'Push-ups', exerciseId: 'push-ups', gentler: 'Hands raised on a chair' },
    { slot: '3', name: 'Alternating reverse lunge', exerciseId: 'reverse-lunge', gentler: 'Split squat, one leg then the other' },
    { slot: '4', name: 'Fast band row', exerciseId: 'band-row', gentler: 'Same movement, slower tempo' },
    { slot: '5', name: 'Mountain climbers', exerciseId: 'mountain-climbers', gentler: 'Hands on a table, walking pace' },
    { slot: '6', name: 'Hollow hold', exerciseId: 'hollow-hold', gentler: 'Slow dead bug, lower back on the floor' },
  ],
  finisher: { optional: false, text: '20 minutes of brisk walking, cycling or rowing at an intensity where you can still say a full sentence. No harder: the point is the duration.' },
  coachNote:
    "This session has two goals that mustn't be confused. The circuit trains your ability to repeat effort; zone 2 trains your heart over time. Don't turn zone 2 into a race: if you finish the 20 minutes too breathless to speak, you went too hard.",
};

// ─── Block 3 · Glow (the guide's "Éclat") · weeks 9–12 ───────────────────────────────

const b3a: StrengthSession = {
  id: 'b3-a', block: 3, letter: 'A', kind: 'strength', name: 'Lower · Strength', focus: 'legs & glutes, heaviest loads', minutes: 50, warmUp: true, page: 35,
  exercises: [
    { slot: '1', name: 'Squat', exerciseId: 'goblet-squat', sets: 4, target: reps(6, 8), rpe: rpe(8), restSeconds: 120,
      home: 'Heavy backpack, or a single-leg squat progression', gym: 'Barbell squat' },
    { slot: '2', name: 'Heavy glute bridge', exerciseId: 'glute-bridge', sets: 4, target: reps(8, 10), rpe: rpe(8), restSeconds: 120,
      home: 'Shoulder blades on the sofa, the heaviest load you have', gym: 'Barbell hip thrust' },
    { slot: '3', name: 'Romanian deadlift', exerciseId: 'romanian-deadlift', sets: 3, target: reps(8, 10), rpe: rpe(8), restSeconds: 90,
      home: 'Loaded bag', gym: 'Dumbbells or a bar', note: '3-second tempo on the way down' },
    { slot: '4', name: 'Walking lunges', exerciseId: 'walking-lunges', sets: 3, target: reps(10, 10, 'leg'), rpe: rpe(8), restSeconds: 90,
      note: 'Walking forward, 10 steps per leg. If space is short: Bulgarian split squat' },
    { slot: '5·A1', name: 'Banded hip abduction', exerciseId: 'banded-hip-abduction', sets: 3, target: reps(20), rpe: rpe(7), restSeconds: null, superset: 'A',
      note: 'Straight into A2 with no rest' },
    { slot: '5·A2', name: 'Standing calf raise', exerciseId: 'standing-calf-raise', sets: 3, target: reps(15), rpe: rpe(7), restSeconds: 60, superset: 'A',
      note: 'On a step, full range' },
  ],
  finisher: { optional: false, text: 'Heavy carry: 4 there-and-back trips of 20 steps, the heaviest load you can hold, arms by your sides, shoulders down, core tight. Write down the load and the distance.' },
  coachNote:
    'With 6 to 8 reps, the classic mistake is jumping too heavy at once. RPE 8 means you have 2 reps left in reserve. If your fourth set is a fight in which your back rounds, the load is too high, and at this stage an injury would cost far more than a little less on the bar.',
};

const b3b: StrengthSession = {
  id: 'b3-b', block: 3, letter: 'B', kind: 'strength', name: 'Upper · Strength', focus: 'back, shoulders, chest & arms', minutes: 50, warmUp: true, page: 36,
  exercises: [
    { slot: '1', name: 'Feet-elevated push-ups', exerciseId: 'push-ups', sets: 4, target: reps(6, 10), rpe: rpe(8), restSeconds: 120,
      note: "Feet on a chair. If that's too much: standard floor push-ups, 4 × 8" },
    { slot: '2', name: 'Heavy single-arm row', exerciseId: 'single-arm-row', sets: 4, target: reps(8, 10, 'arm'), rpe: rpe(8), restSeconds: 90,
      home: 'Backpack loaded as heavy as it goes', gym: 'Dumbbell, supported on a bench' },
    { slot: '3', name: 'Shoulder press', exerciseId: 'shoulder-press', sets: 4, target: reps(8), rpe: rpe(8), restSeconds: 90,
      home: 'Bottles or a bag', gym: 'Dumbbells', note: 'Standing, core tight' },
    { slot: '4', name: 'Lat pulldown or assisted pull-up', exerciseId: 'lat-pulldown', sets: 4, target: reps(8, 10), rpe: rpe(8), restSeconds: 90,
      home: 'Band anchored high up, the strongest one you own' },
    { slot: '5·A1', name: 'Lateral raises', exerciseId: 'lateral-raises', sets: 3, target: reps(15), rpe: rpe(7, 8), restSeconds: null, superset: 'A',
      note: 'Straight into A2 with no rest' },
    { slot: '5·A2', name: 'Chair dips', exerciseId: 'chair-dips', sets: 3, target: reps(10), rpe: rpe(8), restSeconds: 60, superset: 'A',
      note: 'Hands on the edge of a chair, legs straight to make it harder' },
  ],
  finisher: { optional: false, text: 'Plank: 3 × 60 seconds, 45 seconds of rest. If you hold it easily, add an alternating shoulder tap every two seconds.' },
  coachNote:
    "This is the session where many discover they can do a real floor push-up, often between weeks 9 and 11. If that isn't the case yet, it isn't a failure: push-up progress is among the slowest there is. Keep lowering your hand height by a few centimetres every two weeks, it always comes in the end.",
};

const b3c: CircuitSession = {
  id: 'b3-c', block: 3, letter: 'C', kind: 'circuit', name: 'Power', focus: 'whole-body circuit', minutes: 40, warmUp: true, page: 37,
  format: { rounds: 5, workSeconds: 40, restSeconds: 20, betweenRoundsSeconds: 90 },
  exercises: [
    { slot: '1', name: 'Thruster · squat + press', exerciseId: 'thruster', gentler: 'Squat only, arms by your sides' },
    { slot: '2', name: 'Burpee', exerciseId: 'burpee', gentler: 'Step-back burpee, no jump, no push-up' },
    { slot: '3', name: 'Alternating jump lunge', exerciseId: 'alternating-jump-lunge', gentler: 'Alternating reverse lunge on the floor' },
    { slot: '4', name: 'Fast band row', exerciseId: 'band-row', gentler: 'Same movement, controlled tempo' },
    { slot: '5', name: 'Mountain climbers', exerciseId: 'mountain-climbers', gentler: 'Hands on a chair, walking pace' },
    { slot: '6', name: 'Dynamic plank · shoulder taps', exerciseId: 'plank', gentler: 'Static plank, knees down' },
  ],
  finisher: { optional: false, text: '5 minutes of slow walking and ten long breaths, lying down. In for 4, out for 8.' },
  coachNote:
    "This session is meant to be uncomfortable, not dangerous. Burpees and jump lunges are the two movements where technique falls apart fastest under fatigue. The moment you feel you're collapsing rather than lowering, switch to the gentler version for the rest of the round.",
};

export const blocks: readonly [Block, Block, Block] = [
  {
    number: 1, name: 'Foundations', weeks: [1, 2, 3, 4], page: 26,
    summary: '3 full-body sessions, learn the 8 moves',
    intention: 'Learning the eight basic movements, building the habit before building the load.',
    realGoal: "Establishing three weekly appointments and learning eight movements. If after four weeks you've done 10 sessions out of 12 with clean technique, this block is a complete success, whatever the load.",
    loadInstruction: 'Week 1: 2 sets only per exercise, RPE 6. Weeks 2 and 3: 3 sets, RPE 7. Week 4: deload, 2 sets with the load cut by 30 %.',
    rpe: rpe(6, 7), strengthPerWeek: 3, cardioPerWeek: 1,
    sessions: [b1a, b1b, b1c],
  },
  {
    number: 2, name: 'Building', weeks: [5, 6, 7, 8], page: 30,
    summary: 'Upper / lower split, loads climb',
    intention: 'Splitting upper and lower body to work each area for longer. The loads climb markedly.',
    realGoal: 'Increasing the load on every exercise at least once per three-week stretch. This is where your shape starts to change, because this is where the work volume becomes enough.',
    loadInstruction: 'Weeks 5 to 7: RPE 7 to 8, go up as soon as the top of the range is reached on every set. Week 8: deload, 2 sets at −30 %, then the day 60 review.',
    rpe: rpe(7, 8), strengthPerWeek: 3, cardioPerWeek: 1,
    sessions: [b2a, b2b, b2c],
  },
  {
    number: 3, name: 'Glow', weeks: [9, 10, 11, 12], page: 34,
    summary: 'Heavier, fewer reps, tests in week 12',
    intention: 'Fewer reps, more load, a finisher at the end of every session. Week 12 is a testing week.',
    realGoal: 'Fewer reps, more load, a finisher in every session. And above all: redoing the five tests in week 12, and measuring what has changed.',
    loadInstruction: 'RPE 8 on the main movements: you have 2 reps left in reserve, never zero. You never go to failure on a heavy exercise, not even in week 12.',
    rpe: rpe(8), strengthPerWeek: 3, cardioPerWeek: 2,
    sessions: [b3a, b3b, b3c],
  },
];
