import type { OnboardingRecord } from '@/db/repositories';
import type { MarkerId } from '@/domain/programme';
import { isoDate } from '@/lib/dates';

import type { Marker, OnboardingAnswers } from './OnboardingContext';

const markerIds: Record<Marker, MarkerId> = {
  'Morning energy': 'energy',
  Sleep: 'sleep',
  Strength: 'strength',
  Breath: 'breath',
  'Posture & back': 'posture',
  Mood: 'mood',
  Confidence: 'confidence',
};

const slots = ['performance', 'sensation', 'free'] as const;

/** Turns the onboarding answers into what the device stores (src/db, saveOnboarding). */
export function toOnboardingRecord(a: OnboardingAnswers, signedAt: Date): OnboardingRecord {
  const markers: Partial<Record<MarkerId, number>> = {};
  for (const [label, value] of Object.entries(a.markers) as [Marker, number | null][]) if (value != null) markers[markerIds[label]] = value;
  return {
    firstName: a.firstName.trim() || null,
    feelings: [...a.feelings],
    goals: a.goals.map((g, i) => ({ slot: slots[i]!, text: g.text, baseline: g.today || null })),
    health: {
      pregnancyOrPostpartum: a.health.pregnancy,
      medicalCondition: a.health.condition,
      injuryOrSurgery: a.health.injury,
      noTrainingTwoYears: a.health.longBreak,
      pelvicLeaking: a.pelvic.leaking,
      pelvicHeaviness: a.pelvic.heaviness,
      pelvicUrgency: a.pelvic.urgency,
    },
    place: a.place,
    equipment: [...a.equipment],
    markers,
    weekPlan: [...a.week],
    sessionTime: a.sessionTime,
    addToCalendar: a.addToCalendar,
    remindNightBefore: a.nightBeforeReminder,
    photos: (Object.entries(a.photos) as ['front' | 'side' | 'back', string][]).map(([pose, fileUri]) => ({ pose, fileUri })),
    startDate: isoDate(a.startDate),
    signedAt: signedAt.toISOString(),
  };
}
