import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { nextMonday } from '@/lib/dates';

import { defaultWeekPlan, type WeekPlan } from './schedule';

export const FEELINGS = ['Strong', 'Light', 'Rested', 'Grounded', 'Confident', 'Energised'] as const;
export type Feeling = (typeof FEELINGS)[number];
export const MAX_FEELINGS = 3;

export const MARKERS = ['Morning energy', 'Sleep', 'Strength', 'Breath', 'Posture & back', 'Mood', 'Confidence'] as const;
export type Marker = (typeof MARKERS)[number];

export const HEALTH_FLAGS = ['pregnancy', 'condition', 'injury', 'longBreak'] as const;
export type HealthFlag = (typeof HEALTH_FLAGS)[number];

export const PELVIC_SYMPTOMS = ['leaking', 'heaviness', 'urgency'] as const;
export type PelvicSymptom = (typeof PELVIC_SYMPTOMS)[number];

export const EQUIPMENT = ['chair', 'band', 'dumbbells', 'kettlebell', 'backpack', 'none'] as const;
export type Equipment = (typeof EQUIPMENT)[number];

export type Goal = { text: string; today: string };

export type OnboardingAnswers = {
  firstName: string;
  feelings: Feeling[];
  goals: [Goal, Goal, Goal];
  health: Record<HealthFlag, boolean>;
  pelvic: Record<PelvicSymptom, boolean>;
  place: 'home' | 'gym';
  equipment: Equipment[];
  /** 1–10, null until rated. */
  markers: Record<Marker, number | null>;
  week: WeekPlan;
  /** "18:30", local. */
  sessionTime: string;
  addToCalendar: boolean;
  nightBeforeReminder: boolean;
  startDate: Date;
  signed: boolean;
};

const emptyGoal: Goal = { text: '', today: '' };

function initialAnswers(): OnboardingAnswers {
  return {
    firstName: '',
    feelings: [],
    goals: [emptyGoal, emptyGoal, emptyGoal],
    health: { pregnancy: false, condition: false, injury: false, longBreak: false },
    pelvic: { leaking: false, heaviness: false, urgency: false },
    place: 'home',
    equipment: [],
    markers: Object.fromEntries(MARKERS.map((m) => [m, null])) as Record<Marker, number | null>,
    week: defaultWeekPlan,
    sessionTime: '18:30',
    addToCalendar: true,
    nightBeforeReminder: true,
    startDate: nextMonday(new Date()),
    signed: false,
  };
}

type OnboardingContextValue = {
  answers: OnboardingAnswers;
  update: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

/**
 * Holds the answers while the user goes through onboarding.
 * In memory until the contract is signed, then stored on the device in one go (record.ts).
 */
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState(initialAnswers);
  const value = useMemo<OnboardingContextValue>(
    () => ({
      answers,
      update: (key, v) => setAnswers((a) => ({ ...a, [key]: v })),
    }),
    [answers],
  );
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}

/** Toggles `item` in `list`, refusing to grow past `max`. */
export function toggleIn<T>(list: readonly T[], item: T, max = Infinity): T[] {
  if (list.includes(item)) return list.filter((x) => x !== item);
  return list.length >= max ? [...list] : [...list, item];
}
