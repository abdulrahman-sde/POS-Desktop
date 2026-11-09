import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const suppliers = sqliteTable(
  'suppliers',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    phone: text('phone').notNull().default(''),
    address: text('address').notNull().default(''),
    notes: text('notes').notNull().default(''),
    openingBalance: integer('opening_balance').notNull().default(0),
    createdAt: text('created_at').notNull(),
    deletedAt: text('deleted_at')
  },
  (t) => [
    uniqueIndex('suppliers_name_unique')
      .on(sql`lower(${t.name})`)
      .where(sql`${t.deletedAt} is null`)
  ]
)
