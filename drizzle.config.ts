import { defineConfig } from 'drizzle-kit';

// Migrations for the on-device SQLite database (expo-sqlite). Run `npm run db:generate` after a schema change.
export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './src/db/schema.ts',
  out: './drizzle',
});
