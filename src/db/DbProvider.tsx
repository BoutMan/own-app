import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { createDb } from './client';
import type { Db } from './types';

type DbContextValue = {
  db: Db;
  /** Bumped after every write so screens re-read what changed. */
  version: number;
  /** Runs a write, persists it (web preview) and refreshes the screens. */
  write: <T>(fn: (db: Db) => T) => T;
};

const DbContext = createContext<DbContextValue | null>(null);

/** Opens the on-device database before rendering the app. */
export function DbProvider({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const [state, setState] = useState<{ db: Db; persist: () => void } | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    createDb().then(setState, (e: unknown) => setError(e instanceof Error ? e : new Error(String(e))));
  }, []);

  const write = useCallback(
    <T,>(fn: (db: Db) => T): T => {
      if (!state) throw new Error('Database not ready');
      const result = fn(state.db);
      state.persist();
      setVersion((v) => v + 1);
      return result;
    },
    [state],
  );

  const value = useMemo(() => (state ? { db: state.db, version, write } : null), [state, version, write]);

  if (error) throw error;
  if (!value) return <>{fallback}</>;
  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
}

export function useDb(): DbContextValue {
  const ctx = useContext(DbContext);
  if (!ctx) throw new Error('useDb must be used inside DbProvider');
  return ctx;
}

/** Reads from the database and re-reads after every write. */
export function useQuery<T>(read: (db: Db) => T, deps: readonly unknown[] = []): T {
  const { db, version } = useDb();
  return useMemo(() => read(db), [db, version, ...deps]);
}
