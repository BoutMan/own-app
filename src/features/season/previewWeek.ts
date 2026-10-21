import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

import type { WeekNumber } from '@/domain/programme';

/**
 * Web preview only: lets Louison jump to any week (deloads, block 2, test week) without waiting
 * weeks. Kept in this browser's localStorage. Never active in the iOS/Android app.
 */
const KEY = 'own.preview.week';
const listeners = new Set<() => void>();

function read(): WeekNumber | null {
  if (Platform.OS !== 'web') return null;
  try {
    const v = Number(localStorage.getItem(KEY));
    return v >= 1 && v <= 12 ? (v as WeekNumber) : null;
  } catch {
    return null;
  }
}

let current = read();

export function setPreviewWeek(week: WeekNumber | null): void {
  current = week;
  try {
    if (week) localStorage.setItem(KEY, String(week));
    else localStorage.removeItem(KEY);
  } catch {
    // Storage unavailable: the override lasts until reload.
  }
  listeners.forEach((l) => l());
}

export function usePreviewWeek(): WeekNumber | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
    () => null,
  );
}

export const previewToolsEnabled = Platform.OS === 'web';
