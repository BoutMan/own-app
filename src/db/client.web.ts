import { drizzle } from 'drizzle-orm/sql-js';
import initSqlJs from 'sql.js';

import { runMigrations } from './migrate';
import * as schema from './schema';
import type { Db } from './types';

const STORAGE_KEY = 'own.preview.db';

/**
 * Web preview only: SQLite compiled to WebAssembly (sql.js), kept in memory and saved to this
 * browser's localStorage so a test session survives a reload. The iOS/Android app uses
 * expo-sqlite (client.ts) instead.
 */
export async function createDb(): Promise<{ db: Db; persist: () => void }> {
  const wasm = require('sql.js/dist/sql-wasm.wasm') as string | { uri: string };
  const wasmUrl = typeof wasm === 'string' ? wasm : wasm.uri;
  const SQL = await initSqlJs({ locateFile: () => wasmUrl });

  let saved: Uint8Array | undefined;
  try {
    const b64 = localStorage.getItem(STORAGE_KEY);
    if (b64) saved = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  } catch {
    saved = undefined;
  }

  const sqlite = new SQL.Database(saved);
  sqlite.exec('PRAGMA foreign_keys = ON');
  runMigrations({
    exec: (sql) => sqlite.exec(sql),
    appliedTags: () => (sqlite.exec('SELECT tag FROM __own_migrations')[0]?.values ?? []).map((r) => String(r[0])),
  });

  const persist = () => {
    try {
      const bytes = sqlite.export();
      let bin = '';
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
      localStorage.setItem(STORAGE_KEY, btoa(bin));
    } catch {
      // Private mode or storage full: the preview still works, it just forgets on reload.
    }
  };
  return { db: drizzle(sqlite, { schema }), persist };
}
