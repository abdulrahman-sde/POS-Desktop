import { defineConfig } from 'drizzle-kit'

// drizzle-kit is a developer tool (not part of the running app). When you change a table in
// src/shared/<feature>/table.ts, run `npm run db:generate`. It compares the tables with the
// previous migrations and writes a new numbered .sql file into src/main/db/migrations.
// The app runs those files when it starts, so the shop's database upgrades itself.
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/shared/**/table.ts',
  out: './src/main/db/migrations'
})
