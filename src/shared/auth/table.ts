import { sql } from 'drizzle-orm'
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// One row, written only after the owner changes the password. Until then the starting password
// (see auth.service.ts) is used. Only a salted hash is stored, never the password.
export const auth = sqliteTable(
  'auth',
  {
    id: integer('id').primaryKey(),
    salt: text('salt').notNull(),
    hash: text('hash').notNull()
  },
  (t) => [check('auth_single_row', sql`${t.id} = 1`)]
)
