/** The universal warm-up, p. 25. Five minutes before each session. */
export type WarmUpMove = { name: string; dose: string; cue?: string };

export const warmUp = {
  page: 25,
  minutes: 5,
  parts: [
    {
      title: 'Waking the circulation',
      minutes: 2,
      moves: [
        { name: 'High-knee march on the spot', dose: '45 s' },
        { name: 'Butt kicks', dose: '30 s' },
        { name: 'Arm circles, forwards then backwards', dose: '30 s' },
        { name: 'Torso rotations, feet planted', dose: '30 s' },
      ],
    },
    {
      title: 'Opening the joints',
      minutes: 3,
      moves: [
        { name: 'Cat-cow on all fours', dose: '10 ×', cue: 'Mobilises the whole spine, breathe along with it' },
        { name: 'Deep squat hold', dose: '30 s', cue: 'Heels down if you can, elbows pushing the knees apart' },
        { name: 'Lunge with rotation', dose: '5 / side', cue: 'Opens the hip and the upper back in one movement' },
        { name: 'Glute bridge', dose: '15 ×', cue: 'Switches the glutes on before you load them' },
        { name: 'Shoulder pass-throughs with a stick or a towel', dose: '10 ×', cue: 'Wide grip, arms straight, slowly' },
      ],
    },
  ] satisfies { title: string; minutes: number; moves: WarmUpMove[] }[],
  warmUpSet:
    "On the first heavy exercise of the session only, do a set of 8 reps empty or very light before your first real set. It doesn't count towards the prescribed sets.",
  coolDown: 'Three minutes of slow walking and a few long breaths.',
} as const;
