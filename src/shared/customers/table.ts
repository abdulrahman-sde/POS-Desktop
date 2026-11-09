import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const customers = sqliteTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull().default(''),
  address: text('address').notNull().default(''),
  notes: text('notes').notNull().default(''),
  openingBalance: integer('opening_balance').notNull().default(0),
  createdAt: text('created_at').notNull(),
  deletedAt: text('deleted_at')
})
