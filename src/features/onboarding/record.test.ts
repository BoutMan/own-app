import { describe, expect, it } from '@jest/globals';

import { toOnboardingRecord } from './record';
import type { OnboardingAnswers } from './OnboardingContext';
import { defaultWeekPlan } from './schedule';

const answers: OnboardingAnswers = {
  firstName: ' Jade ',
  why: '  Feeling strong carrying my kids. ',
  feelings: ['Strong'],
  goals: [
    { text: '10 push-ups', today: '3' },
    { text: '', today: '' },
    { text: 'Jeans', today: '' },
  ],
  health: { pregnancy: false, condition: false, injury: false, longBreak: true },
  pelvic: { leaking: true, heaviness: false, urgency: false },
  place: 'home',
  equipment: ['band'],
  markers: { 'Morning energy': 4, Sleep: null, Strength: null, Breath: null, 'Posture & back': null, Mood: 6, Confidence: null },
  week: defaultWeekPlan,
  sessionTime: '07:15',
  addToCalendar: false,
  nightBeforeReminder: true,
  startDate: new Date(2026, 10, 2),
  signed: true,
  signature: ['M1 1 L5 5'],
  photos: { front: 'file:///vault/front.jpg' },
};

describe('onboarding record', () => {
  it('maps the answers to what the device stores', () => {
    const r = toOnboardingRecord(answers, new Date('2026-10-30T10:00:00Z'));
    expect(r).toMatchObject({
      firstName: 'Jade',
      myWhy: 'Feeling strong carrying my kids.',
      markers: { energy: 4, mood: 6 },
      sessionTime: '07:15',
      startDate: '2026-11-02',
      signature: ['M1 1 L5 5'],
      photos: [{ pose: 'front', fileUri: 'file:///vault/front.jpg' }],
      health: { noTrainingTwoYears: true, pelvicLeaking: true },
    });
    expect(r.goals.map((g) => g.slot)).toEqual(['performance', 'sensation', 'free']);
  });
});
