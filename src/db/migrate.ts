import bundle from '../../drizzle/migrations';

/** Raw SQL executor of the underlying driver (expo-sqlite or sql.js). */
export type ExecSql = {
  exec: (sql: string) => void;
  /** Returns the tags already applied. */
  appliedTags: () => string[];
};

/**
 * Applies the drizzle-kit migrations bundled with the app, in order, once each. Shared by the
 * device (expo-sqlite) and the web preview (sql.js) so both run exactly the same SQL.
 */
export function runMigrations(db: ExecSql): string[] {
  db.exec('CREATE TABLE IF NOT EXISTS __own_migrations (tag TEXT PRIMARY KEY, applied_at TEXT NOT NULL)');
  const done = new Set(db.appliedTags());
  const applied: string[] = [];
  for (const entry of bundle.journal.entries) {
    if (done.has(entry.tag)) continue;
    const key = `m${String(entry.idx).padStart(4, '0')}`;
    const sql = bundle.migrations[key];
    if (!sql) throw new Error(`Migration ${entry.tag} is missing from drizzle/migrations.js`);
    db.exec('BEGIN');
    try {
      for (const statement of sql.split('--> statement-breakpoint')) {
        if (statement.trim()) db.exec(statement);
      }
      db.exec(`INSERT INTO __own_migrations (tag, applied_at) VALUES ('${entry.tag}', '${new Date().toISOString()}')`);
      db.exec('COMMIT');
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }
    applied.push(entry.tag);
  }
  return applied;
}
