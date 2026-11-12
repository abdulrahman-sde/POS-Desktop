import { sql } from 'drizzle-orm'
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// One row, written when the starting data file has been imported. While it is there the import cannot run again.
// NOTE: table.ts files use RELATIVE imports only (drizzle-kit reads them directly).
export const starterImport = sqliteTable(
  'starter_import',
  {
    id: integer('id').primaryKey(),
    importedAt: text('imported_at').notNull()
  },
  (t) => [check('starter_import_single_row', sql`${t.id} = 1`)]
)
