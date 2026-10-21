import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import { runMigrations } from './migrate';
import * as schema from './schema';
import type { Db } from './types';

export const DB_NAME = 'own.db';

/**
 * Opens the on-device database and brings it up to date. It lives in the app sandbox and is never
 * synced by the app (CLAUDE.md, rule 1); it is part of the user's own iOS backup.
 */
export async function createDb(): Promise<{ db: Db; persist: () => void }> {
  const sqlite = openDatabaseSync(DB_NAME);
  sqlite.execSync('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
  runMigrations({
    exec: (sql) => sqlite.execSync(sql),
    appliedTags: () => sqlite.getAllSync<{ tag: string }>('SELECT tag FROM __own_migrations').map((r) => r.tag),
  });
  // SQLite writes to disk itself on the device: nothing to persist by hand.
  return { db: drizzle(sqlite, { schema }), persist: () => {} };
}
