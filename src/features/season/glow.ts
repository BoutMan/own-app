import type { IconName } from '@/components';
import { exercises } from '@/content/exercises';
import { useQuery } from '@/db/DbProvider';
import { loadProgress, markersAt, recentCheckIns } from '@/db/repositories';
import { checkpoints, type MarkerId } from '@/domain/programme';
import { formatLoad, type UnitSystem } from '@/domain/units';
import { formatShort } from '@/lib/dates';
import type { Tone } from '@/theme';

import type { SeasonState } from './currentWeek';

export const MARKER_META: readonly { id: MarkerId; label: string; icon: IconName; tone: Tone }[] = [
  { id: 'energy', label: 'Energy', icon: 'bolt', tone: 'vanilla' },
  { id: 'sleep', label: 'Sleep', icon: 'moon', tone: 'fog' },
  { id: 'strength', label: 'Strength', icon: 'dumbbell', tone: 'latte' },
  { id: 'breath', label: 'Breath', icon: 'breath', tone: 'fog' },
  { id: 'posture', label: 'Posture & back', icon: 'posture', tone: 'mauve' },
  { id: 'mood', label: 'Mood', icon: 'smile', tone: 'vanilla' },
  { id: 'confidence', label: 'Confidence', icon: 'crown', tone: 'mauve' },
];

export type MarkerRow = (typeof MARKER_META)[number] & { day0: number | null; now: number | null };

/**
 * The seven markers: day 0 from onboarding, "now" from the latest block review, and for energy,
 * sleep and mood the latest Sunday check-in when there is one (it is more recent).
 */
export function useMarkers(season: number | null): MarkerRow[] {
  return useQuery(
    (db) => {
      const at = season === null ? [] : checkpoints.map((c) => markersAt(db, season, c));
      const checkIn = season === null ? undefined : recentCheckIns(db, season, 1)[0];
      const fromCheckIn: Partial<Record<MarkerId, number | null>> = { energy: checkIn?.energy, sleep: checkIn?.sleep, mood: checkIn?.mood };
      return MARKER_META.map((m) => {
        const day0 = at[0]?.[m.id] ?? null;
        const reviewed = [...at].reverse().find((v) => v[m.id] != null)?.[m.id] ?? null;
        return { ...m, day0, now: fromCheckIn[m.id] ?? reviewed };
      });
    },
    [season],
  );
}

const WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'] as const;

/** The glow card on Progress: four lines about the season so far, never the scale. */
export function useGlowCard(season: SeasonState, markers: MarkerRow[], units: UnitSystem) {
  const lifts = useQuery((db) => (season.season === null ? [] : loadProgress(db, season.season)), [season.season]);
  const word = WORDS[season.week - 1]!;
  const lines = [`${season.sessionsKept} ${season.sessionsKept === 1 ? 'session' : 'sessions'} kept`];
  const lift = lifts.find((l) => l.toKg > l.fromKg);
  if (lift) {
    const name = exercises.find((e) => e.id === lift.exerciseId)?.name ?? 'Main lift';
    lines.push(`${name} ${formatLoad(lift.fromKg, units)} → ${formatLoad(lift.toKg, units)}`);
  }
  const best = markers
    .filter((m) => m.day0 != null && m.now != null && m.now > m.day0)
    .sort((a, b) => b.now! - b.day0! - (a.now! - a.day0!))[0];
  if (best) lines.push(`${best.label} ${best.day0} → ${best.now} / 10`);
  lines.push(season.restarts === 0 ? 'Never missed twice' : 'Came back every time');
  return { title: `week ${word}`, accent: word, range: `${formatShort(season.startDate)} → ${formatShort(new Date())}`.toLowerCase(), lines };
}
