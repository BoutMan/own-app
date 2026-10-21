import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema';

export const DB_NAME = 'own.db';

/**
 * Opens the on-device database. It lives in the app sandbox and is never synced anywhere
 * (CLAUDE.md, rule 1). Run the migrations with `useMigrations(db, migrations)` from
 * `drizzle-orm/expo-sqlite/migrator` before the first query.
 */
export function openDb() {
  const sqlite = openDatabaseSync(DB_NAME);
  sqlite.execSync('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
  return drizzle(sqlite, { schema });
}
