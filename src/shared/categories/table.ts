import { sql } from 'drizzle-orm'
import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

// NOTE: files named table.ts use RELATIVE imports only. drizzle-kit (the tool that writes the
// migration files) reads them directly and does not know the "@shared" shortcut.
export const categories = sqliteTable(
  'categories',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull()
  },
  (t) => [
    // Two categories cannot share a name, even if the capital letters differ.
    uniqueIndex('categories_name_unique').on(sql`lower(${t.name})`)
  ]
)
