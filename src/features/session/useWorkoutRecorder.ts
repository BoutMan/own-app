import { useCallback, useRef } from 'react';

import { useDb } from '@/db/DbProvider';
import { activeSeason, finishWorkout, logSet, setRpe, startSeason, startWorkout, type LoggedSet } from '@/db/repositories';
import { mondayOf } from '@/domain/engine/season';
import { isoDate } from '@/lib/dates';

type Start = { sessionId: string; week: number; mode: 'home' | 'gym'; variant: string; loadFactor: number };

/**
 * Records a guided session on the device. The workout row is created on the first logged set, so
 * opening and closing a session leaves nothing behind. The first workout ever starts season 1.
 */
export function useWorkoutRecorder(start: Start) {
  const { write } = useDb();
  const workoutId = useRef<string | null>(null);
  const startRef = useRef(start);
  startRef.current = start;

  const ensureWorkout = useCallback((): string => {
    if (workoutId.current) return workoutId.current;
    const id = write((db) => {
      const season = activeSeason(db)?.number ?? startSeason(db, isoDate(mondayOf(new Date())));
      return startWorkout(db, { ...startRef.current, season });
    });
    workoutId.current = id;
    return id;
  }, [write]);

  const log = useCallback(
    (set: LoggedSet): number => {
      const id = ensureWorkout();
      return write((db) => logSet(db, id, set));
    },
    [ensureWorkout, write],
  );

  const rate = useCallback((setId: number, rpe: number) => write((db) => setRpe(db, setId, rpe)), [write]);

  const finish = useCallback((): string => {
    const id = ensureWorkout();
    write((db) => finishWorkout(db, id, null));
    return id;
  }, [ensureWorkout, write]);

  return { workoutId, log, rate, finish };
}
