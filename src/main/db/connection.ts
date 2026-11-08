import Database from 'better-sqlite3'
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

import * as schema from '@shared/schema'

export type Db = BetterSQLite3Database<typeof schema>
// Inside db.transaction(...) you get a "tx" that works like db. Query functions accept either.
export type DbOrTx = Db | Parameters<Parameters<Db['transaction']>[0]>[0]

let db: Db | null = null
let sqlite: Database.Database | null = null

// Opens the database file (creating it the first time) and brings its tables up to date.
// This file knows nothing about Electron on purpose, so it can also be used in tests.
export function initDb(filePath: string, migrationsFolder: string): Db {
  sqlite = new Database(filePath)
  // WAL keeps the file safe if the computer is switched off in the middle of a save.
  sqlite.pragma('journal_mode = WAL')
  // Without this SQLite ignores "this belongs to that category" links.
  sqlite.pragma('foreign_keys = ON')

  db = drizzle(sqlite, { schema })
  // Runs every .sql file in the migrations folder that has not run on this database yet.
  migrate(db, { migrationsFolder })
  return db
}

export function getDb(): Db {
  if (!db) throw new Error('The database is not open yet.')
  return db
}

export function closeDb(): void {
  sqlite?.close()
  sqlite = null
  db = null
}
