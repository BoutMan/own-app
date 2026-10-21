import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';

import type * as schema from './schema';

/**
 * Any synchronous Drizzle SQLite database with our schema: expo-sqlite on the device,
 * better-sqlite3 in tests. Repositories only depend on this type.
 */
export type Db = BaseSQLiteDatabase<'sync', unknown, typeof schema>;
