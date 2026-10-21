/**
 * Progression rules as the guide states them. The session engine (milestone 3) turns these into
 * code; they live here as data so every rule keeps its source page.
 */

/** The +1 rule, p. 38: in every session, one of these improvements per exercise, in this order. */
export const plusOneSteps = [
  { id: 'rep', label: 'One more rep', detail: 'Up to the top of the prescribed range.' },
  { id: 'load', label: 'A heavier load', detail: 'When you reach the top of the range on every set. Go up by 1 to 2.5 kg, no more.' },
  { id: 'range', label: 'A bigger range', detail: 'Going a little lower on the squat, touching your chest on the push-up.' },
  { id: 'tempo', label: 'A slower tempo', detail: '3 seconds down instead of 1.' },
  { id: 'rest', label: 'Less rest', detail: 'As a last resort only, and never on the heavy movements.' },
] as const;

export const progressionRules = {
  page: 38,
  /** p. 38: a load step is 1 to 2.5 kg, no more. */
  loadStepKg: { min: 1, max: 2.5 },
  /** p. 38: three sessions without progress on an exercise is a stall signal. */
  stallAfterSessions: 3,
  stallChecklist: ['Sleep', 'Protein', 'Rest between sets', 'The actual load'],
  stallRemedy: 'If everything checks out and it is still stalled: take a deload week early.',
  /** p. 38: 30 strength sessions out of 36 is a successful programme. */
  successfulSeason: { sessions: 30, of: 36 },
} as const;

/** Missed weeks, p. 23 and p. 55. */
export const missedTraining = {
  /** p. 23: you pick up the week you stopped at, with 10 % less load on the first session. */
  oneWeek: { resume: 'same week', loadFactor: 0.9, sessions: 1, page: 23 },
  /** p. 23 and p. 55: restart at the beginning of the current block, 20 % less load for the first week. */
  twoWeeksOrMore: { resume: 'block start', loadFactor: 0.8, weeks: 1, page: 55 },
  /** p. 55: after illness below the neck, come back at 70 % of your loads for two sessions. */
  afterIllness: { loadFactor: 0.7, sessions: 2, page: 55 },
} as const;

/** "When life gets in the way", p. 55: the seven cases behind "My week is complicated". */
export const lifeHappens = [
  { id: 'away', label: "I'm away for a few days", rule: 'Session C from your current block with a band, plus a walk.' },
  { id: 'ill', label: "I'm ill", rule: 'Symptoms above the neck: a lighter session is possible. Below the neck (fever, chesty cough, aches): no training. Come back at 70 % of your loads for two sessions.' },
  { id: 'period', label: 'Period pain', rule: 'Nothing obliges you to train. If you feel up to it: loads −20 % and the core work swapped for a walk.' },
  { id: 'short', label: 'Only 20 minutes', rule: 'The first three exercises of the planned session, in order, without the finisher.' },
  { id: 'packed', label: 'The gym is packed', rule: 'Take the home version of that line, or reorder the exercises, except the first, which stays first.' },
  { id: 'noKit', label: 'No equipment', rule: 'Bodyweight versions with a 3-1-1 tempo: three seconds down, one pause, one second up.' },
  { id: 'break', label: 'I stopped for 2+ weeks', rule: 'Restart at the beginning of the current block, with 20 % less load for the first week.' },
] as const;

/** p. 55: pain rule. The app recommends, it never diagnoses (CLAUDE.md, rule 3). */
export const painRule =
  'Discomfort that disappears once you are warm: carry on while keeping an eye on it. Pain that grows during the set, that is sharp, in a joint, or radiating down a limb: stop the exercise, replace it with a movement from the same family that does not hurt, and if it lasts more than a week, get it checked. Never push through joint pain.';
