/**
 * The 35 exercise cards of the guide ("04 · Library", pp. 41–47): start, movement, common mistake.
 * Generated from docs/Eclat-Movement-Guide.pdf; edit by hand only to fix extraction errors.
 */

export type ExerciseFamily = 'lower' | 'upper' | 'core' | 'circuit' | 'prevention';

export type Exercise = {
  id: string;
  /** Card number in the guide, 1–35. */
  number: number;
  name: string;
  family: ExerciseFamily;
  muscles: string[];
  start: string;
  movement: string;
  mistake: string;
  /** Page in docs/Eclat-Movement-Guide.pdf. */
  page: number;
};

export const exercises: Exercise[] = [
  {
    "id": "goblet-squat",
    "number": 1,
    "name": "Goblet squat",
    "family": "lower",
    "muscles": [
      "Quads",
      "Glutes",
      "Core"
    ],
    "start": "Feet shoulder-width apart, toes turned very slightly out. Load held tight to the chest, elbows tucked in.",
    "movement": "Sit down and slightly back, chest tall, until your thighs are parallel to the floor. Come up by driving through your heels.",
    "mistake": "Knees caving inwards. Think about “spreading the floor” with your feet all the way down.",
    "page": 41
  },
  {
    "id": "romanian-deadlift",
    "number": 2,
    "name": "Romanian deadlift",
    "family": "lower",
    "muscles": [
      "Hamstrings",
      "Glutes",
      "Back"
    ],
    "start": "Standing, feet hip-width apart, knees very slightly bent and staying that way. Load in front of your thighs.",
    "movement": "Push your hips back keeping your back perfectly flat. The load brushes your legs. Go down until you feel the hamstrings stretch, then come back up squeezing the glutes.",
    "mistake": "Rounding the lower back, or bending the knees as in a squat. This isn't a descent: it's the hips travelling backwards.",
    "page": 41
  },
  {
    "id": "glute-bridge",
    "number": 3,
    "name": "Glute bridge · Hip thrust",
    "family": "lower",
    "muscles": [
      "Glutes",
      "Hamstrings"
    ],
    "start": "Lying on your back, knees bent, feet flat 30 cm from your hips. Advanced version: shoulder blades resting on a sofa.",
    "movement": "Lift your hips squeezing the glutes hard, until shoulders, hips and knees are in line. One-second pause at the top, then lower without resting all the way down.",
    "mistake": "Arching the lower back to get higher. Keep your ribs down: it's the glutes that lift the pelvis, not the lower back.",
    "page": 41
  },
  {
    "id": "reverse-lunge",
    "number": 4,
    "name": "Reverse lunge",
    "family": "lower",
    "muscles": [
      "Quads",
      "Glutes",
      "Balance"
    ],
    "start": "Standing, feet together, torso upright, eyes ahead. One hand on a wall if balance is short.",
    "movement": "Take a long step back and lower the rear knee toward the floor without touching it. The front knee stays over the ankle. Push through the front heel to return.",
    "mistake": "Too short a step, which puts all the load on the front knee. If you feel any knee discomfort, lengthen the step.",
    "page": 41
  },
  {
    "id": "bulgarian-split-squat",
    "number": 5,
    "name": "Bulgarian split squat",
    "family": "lower",
    "muscles": [
      "Glutes",
      "Quads",
      "Stability"
    ],
    "start": "Toes of the back foot resting on a chair, front foot a long step ahead. Torso leaning slightly forward.",
    "movement": "Lower straight down, rear knee toward the floor. All the weight stays in the front heel. Come up without locking the knee.",
    "mistake": "Pushing off the back leg. It's only there for balance - if you feel it working, move your front foot further forward.",
    "page": 41
  },
  {
    "id": "walking-lunges",
    "number": 6,
    "name": "Walking lunges",
    "family": "lower",
    "muscles": [
      "Quads",
      "Glutes",
      "Cardio"
    ],
    "start": "Standing, with a hallway or a room 5 to 6 metres long ahead of you. Weights by your sides if you have them.",
    "movement": "Take a long step forward, lower the rear knee toward the floor, then go straight into the next step without standing up in between.",
    "mistake": "Leaning forward as you push off. Keep your torso vertical and your shoulders over your hips.",
    "page": 42
  },
  {
    "id": "step-up",
    "number": 7,
    "name": "Step-up",
    "family": "lower",
    "muscles": [
      "Glutes",
      "Quads"
    ],
    "start": "In front of a stair or a stable bench, roughly knee height.",
    "movement": "Place one whole foot on the step and rise using that leg only. Lower slowly, controlling the descent over 2 seconds.",
    "mistake": "Pushing off with the bottom leg. If you have to push with the foot on the floor, the step is too high.",
    "page": 42
  },
  {
    "id": "banded-hip-abduction",
    "number": 8,
    "name": "Banded hip abduction",
    "family": "lower",
    "muscles": [
      "Glute Medius",
      "Hips"
    ],
    "start": "Loop band placed just above the knees. Seated on a chair, or lying on your side.",
    "movement": "Push the knees apart against the resistance, 2 seconds at full opening, then return slowly without releasing the tension completely.",
    "mistake": "Going too fast. It's a small muscle: the quality of the contraction matters more than the range.",
    "page": 42
  },
  {
    "id": "standing-calf-raise",
    "number": 9,
    "name": "Standing calf raise",
    "family": "lower",
    "muscles": [
      "Calves",
      "Ankles"
    ],
    "start": "Balls of the feet on the edge of a step, heels hanging free. One hand resting for balance.",
    "movement": "Rise as high as you can onto your toes, pause for a second, then drop your heels below the level of the step for a full stretch.",
    "mistake": "Doing small quick bounces. The full range, top and bottom, does all the work.",
    "page": 42
  },
  {
    "id": "wall-sit",
    "number": 10,
    "name": "Wall sit",
    "family": "lower",
    "muscles": [
      "Quads",
      "Mindset"
    ],
    "start": "Back flat against a wall, feet about 50 cm forward, hip-width apart.",
    "movement": "Slide down the wall until your thighs are parallel to the floor, knees at 90°. Hold the position, breathing normally.",
    "mistake": "Resting your hands on your thighs to take the load off. Arms crossed or by your sides - and count the seconds.",
    "page": 42
  },
  {
    "id": "push-ups",
    "number": 11,
    "name": "Push-ups",
    "family": "upper",
    "muscles": [
      "Chest",
      "Shoulders",
      "Triceps"
    ],
    "start": "Hands slightly wider than your shoulders. Progression from easiest to hardest: hands on a wall → on a counter → on a chair → knees down → feet down.",
    "movement": "Lower keeping your body perfectly in line, elbows at 45° to your torso. Almost touch the surface, then press back up.",
    "mistake": "Hips sagging or riding up. Squeeze your glutes and your core: the body has to stay a plank from start to finish.",
    "page": 43
  },
  {
    "id": "band-row",
    "number": 12,
    "name": "Band row",
    "family": "upper",
    "muscles": [
      "Back",
      "Biceps",
      "Posture"
    ],
    "start": "Seated on the floor, legs straight, band around your feet or a table leg, one end in each hand.",
    "movement": "Pull your elbows back along your sides, squeezing the shoulder blades at the end of the movement. Return slowly, under control.",
    "mistake": "Letting the shoulders rise toward your ears. Think “shoulders down, elbows to the hips”.",
    "page": 43
  },
  {
    "id": "single-arm-row",
    "number": 13,
    "name": "Single-arm row",
    "family": "upper",
    "muscles": [
      "Back",
      "Core"
    ],
    "start": "One knee and one hand resting on a chair or a bench, back flat and parallel to the floor. Load in the free hand, arm straight.",
    "movement": "Pull the load toward your hip keeping the elbow close to your body. The torso doesn't rotate. Lower under control over 2 seconds.",
    "mistake": "Twisting the torso to pull heavier. If your shoulders don't stay parallel to the floor, the load is too heavy.",
    "page": 43
  },
  {
    "id": "lat-pulldown",
    "number": 14,
    "name": "Lat pulldown",
    "family": "upper",
    "muscles": [
      "Back",
      "Biceps"
    ],
    "start": "Kneeling under a band anchored at the top of a closed door, arms straight overhead. In the gym: cable pulldown.",
    "movement": "Pull your elbows down and back, chest open, until your hands reach chin height.",
    "mistake": "Leaning far back to compensate. Keep your torso almost vertical and reduce the resistance if you need to.",
    "page": 43
  },
  {
    "id": "shoulder-press",
    "number": 15,
    "name": "Shoulder press",
    "family": "upper",
    "muscles": [
      "Shoulders",
      "Triceps",
      "Core"
    ],
    "start": "Standing or seated, weights at ear height, elbows under your wrists, core tight.",
    "movement": "Press up until your arms are straight without locking the elbows. Lower back to ear height.",
    "mistake": "Arching the lower back as you press. Brace your abs and glutes: the press starts from the trunk, not the lower back.",
    "page": 43
  },
  {
    "id": "lateral-raises",
    "number": 16,
    "name": "Lateral raises",
    "family": "upper",
    "muscles": [
      "Shoulders"
    ],
    "start": "Standing, light weights by your sides, elbows very slightly bent.",
    "movement": "Raise your arms out to the sides up to shoulder height, no higher. Lower over 3 seconds.",
    "mistake": "Going too heavy and heaving with the back. This is the exercise where the lightest weight gives the best result.",
    "page": 44
  },
  {
    "id": "biceps-curl",
    "number": 17,
    "name": "Biceps curl",
    "family": "upper",
    "muscles": [
      "Biceps"
    ],
    "start": "Standing, weights held underhand (palms forward), elbows tight to the body.",
    "movement": "Curl the weights toward your shoulders without moving your elbows, then lower slowly to full extension.",
    "mistake": "Swinging the torso to launch the weight. If you have to use your back, drop a level of load.",
    "page": 44
  },
  {
    "id": "chair-dips",
    "number": 18,
    "name": "Chair dips",
    "family": "upper",
    "muscles": [
      "Triceps",
      "Shoulders"
    ],
    "start": "Hands on the edge of a stable chair behind you, fingers forward. Legs bent (easy) or straight (hard).",
    "movement": "Lower by bending your elbows backwards, to about 90°. Press back up through your palms.",
    "mistake": "Going too low, which pulls on the front of the shoulder. Stop at 90° of elbow bend.",
    "page": 44
  },
  {
    "id": "overhead-triceps-extension",
    "number": 19,
    "name": "Overhead triceps extension",
    "family": "upper",
    "muscles": [
      "Triceps"
    ],
    "start": "One weight held in both hands overhead, arms straight, elbows squeezed forward.",
    "movement": "Lower the weight behind your head moving only your forearms, then press back to full extension.",
    "mistake": "Letting the elbows flare. Imagine they're held in a vice pointing forward.",
    "page": 44
  },
  {
    "id": "thruster",
    "number": 20,
    "name": "Thruster · squat + press",
    "family": "upper",
    "muscles": [
      "Full Body",
      "Cardio"
    ],
    "start": "Weights at shoulder height, feet shoulder-width apart.",
    "movement": "Drop into a full squat, then come up and go straight into an overhead press. The press uses the momentum from your legs.",
    "mistake": "Separating the two movements. It's one continuous action: coming out of the squat launches the press.",
    "page": 44
  },
  {
    "id": "plank",
    "number": 21,
    "name": "Plank",
    "family": "core",
    "muscles": [
      "Deep Core",
      "Shoulders"
    ],
    "start": "On your forearms, elbows under your shoulders, feet hip-width apart. Knees down for the easy version.",
    "movement": "Squeeze your glutes, tuck your pelvis slightly, and hold while breathing normally. The body forms a straight line from heels to head.",
    "mistake": "Arching the lower back or lifting your hips. 20 perfect seconds beat 60 saggy ones.",
    "page": 45
  },
  {
    "id": "side-plank",
    "number": 22,
    "name": "Side plank",
    "family": "core",
    "muscles": [
      "Obliques",
      "Hips"
    ],
    "start": "On your side, propped on one forearm, elbow under your shoulder. Legs straight, one on the other, or knees bent.",
    "movement": "Lift your hips until ankle, hip and shoulder are in line. Hold, then switch sides.",
    "mistake": "Letting the hips drop little by little. The moment you feel them fall, end the set.",
    "page": 45
  },
  {
    "id": "dead-bug",
    "number": 23,
    "name": "Dead bug",
    "family": "core",
    "muscles": [
      "Deep Core",
      "Coordination"
    ],
    "start": "Lying on your back, arms straight toward the ceiling, knees bent at 90° above your hips. Lower back pressed to the floor.",
    "movement": "Slowly lower one arm and the opposite leg toward the floor, without letting your back lift. Return, then switch sides.",
    "mistake": "Letting the lower back lift. That's the only criterion: as soon as it lifts, reduce the range.",
    "page": 45
  },
  {
    "id": "hollow-hold",
    "number": 24,
    "name": "Hollow hold",
    "family": "core",
    "muscles": [
      "Abs",
      "Core"
    ],
    "start": "Lying on your back, lower back flat on the floor, arms and legs straight.",
    "movement": "Lift your shoulders and legs a few centimetres off the floor, the body forming a banana. Hold while keeping your back pressed down.",
    "mistake": "Straightening the legs too soon. Start with knees bent and arms by your sides, then extend gradually.",
    "page": 45
  },
  {
    "id": "superman",
    "number": 25,
    "name": "Superman",
    "family": "core",
    "muscles": [
      "Lower Back",
      "Glutes",
      "Posture"
    ],
    "start": "Face down, arms straight ahead, legs straight.",
    "movement": "Lift chest and legs a few centimetres at the same time, eyes toward the floor, 2 seconds at the top, then lower gently.",
    "mistake": "Lifting the head into neck hyperextension. Your gaze stays on the floor throughout the movement.",
    "page": 45
  },
  {
    "id": "jump-squat",
    "number": 26,
    "name": "Jump squat",
    "family": "circuit",
    "muscles": [
      "Quads",
      "Glutes",
      "Cardio"
    ],
    "start": "Standing, feet shoulder-width apart, arms free.",
    "movement": "Drop into a squat, then drive hard through your legs to leave the floor. Land on the front of your foot, knees soft, and go again.",
    "mistake": "Landing with straight legs and heels slapping the floor. The landing should be silent: if it makes a noise, switch to the no-jump version.",
    "page": 46
  },
  {
    "id": "alternating-jump-lunge",
    "number": 27,
    "name": "Alternating jump lunge",
    "family": "circuit",
    "muscles": [
      "Legs",
      "Balance",
      "Cardio"
    ],
    "start": "In a lunge position, rear knee close to the floor, torso upright.",
    "movement": "Jump and switch legs in the air, landing straight into a lunge on the other side, controlling the descent.",
    "mistake": "Leaning forward and letting the front knee travel far past the ankle. If in doubt, do alternating reverse lunges with no jump.",
    "page": 46
  },
  {
    "id": "mountain-climbers",
    "number": 28,
    "name": "Mountain climbers",
    "family": "circuit",
    "muscles": [
      "Abs",
      "Shoulders",
      "Cardio"
    ],
    "start": "In a straight-arm plank, hands under your shoulders, body in line.",
    "movement": "Draw one knee toward your chest then the other, alternating at a steady rhythm. The hips stay low and stable.",
    "mistake": "Letting the hips rise with every rep. If that happens, slow down or put your hands on a table.",
    "page": 46
  },
  {
    "id": "burpee",
    "number": 29,
    "name": "Burpee",
    "family": "circuit",
    "muscles": [
      "Full Body",
      "Cardio"
    ],
    "start": "Standing, feet hip-width apart.",
    "movement": "Hands to the floor, step or hop your feet back into a plank, do a push-up (optional), bring your feet back in, then stand up with a jump. Gentler version: step one foot back after the other, no jump, no push-up.",
    "mistake": "The back rounding as you bring your feet in. Under fatigue, go back to the step-by-step version rather than letting the position break down.",
    "page": 46
  },
  {
    "id": "brisk-walk-in-zone-2",
    "number": 30,
    "name": "Brisk walk in zone 2",
    "family": "circuit",
    "muscles": [
      "Heart",
      "Recovery"
    ],
    "start": "Outside if possible, comfortable shoes, 30 to 45 minutes ahead of you.",
    "movement": "Walk at a pace where you can say a full sentence while out of breath, but not sing. A slight incline is enough to step it up a level.",
    "mistake": "Trying to turn it into a race. The benefit comes from the time held, not the intensity - and too hard a zone 2 ruins the next day's strength session.",
    "page": 46
  },
  {
    "id": "banded-leg-curl",
    "number": 31,
    "name": "Banded leg curl",
    "family": "prevention",
    "muscles": [
      "Hamstrings",
      "Knee"
    ],
    "start": "Face down, loop band around your ankles, the other end anchored in front of you - a furniture leg or the bottom of a door.",
    "movement": "Bend your knees to bring your heels toward your hips: 2 seconds up, 3 down. The pelvis stays pressed to the floor.",
    "mistake": "Lifting the hips to help. If that happens, reduce the tension - this is a small finishing movement, not a strength exercise.",
    "page": 47
  },
  {
    "id": "banded-external-rotation",
    "number": 32,
    "name": "Banded external rotation",
    "family": "prevention",
    "muscles": [
      "Rotator cuff",
      "Shoulder"
    ],
    "start": "Standing, elbow bent to 90° and tight to your side, a rolled towel wedged between elbow and ribs. Band anchored at navel height.",
    "movement": "Rotate your forearm outwards without letting the elbow leave your side, then return slowly. Modest range, constant tension.",
    "mistake": "Using too strong a band and compensating with the whole torso. This is the exercise where the lightest protects the best.",
    "page": 47
  },
  {
    "id": "carry",
    "number": 33,
    "name": "Carry · farmer's walk",
    "family": "prevention",
    "muscles": [
      "Core",
      "Grip",
      "Posture"
    ],
    "start": "A heavy weight in each hand, arms by your sides, shoulders down and back, core tight.",
    "movement": "Walk 20 even steps, turn around, come back. Breathe normally: above all, don't hold your breath.",
    "mistake": "Leaning to one side or letting your shoulders round forward. If your posture collapses, put the weights down: the set is over.",
    "page": 47
  },
  {
    "id": "bird-dog",
    "number": 34,
    "name": "Bird dog",
    "family": "prevention",
    "muscles": [
      "Lower Back",
      "Anti-rotation"
    ],
    "start": "On all fours, hands under your shoulders, knees under your hips, back flat like a table.",
    "movement": "Extend one arm and the opposite leg to horizontal at the same time, 2 seconds, then return. The pelvis doesn't tilt.",
    "mistake": "Letting the pelvis rotate. Balance a bottle on your lower back: it mustn't fall off.",
    "page": 47
  },
  {
    "id": "single-leg-glute-bridge",
    "number": 35,
    "name": "Single-leg glute bridge",
    "family": "prevention",
    "muscles": [
      "Glutes",
      "Pelvic balance"
    ],
    "start": "Lying on your back, one foot on the floor, the other knee drawn toward your chest.",
    "movement": "Lift your pelvis by pushing through the heel on the floor, without letting the opposite hip drop. One-second pause at the top.",
    "mistake": "Letting one hip sit lower than the other - that is precisely the imbalance this exercise exists to correct.",
    "page": 47
  }
];
