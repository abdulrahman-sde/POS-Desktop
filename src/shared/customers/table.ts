import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const customers = sqliteTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull().default(''),
  address: text('address').notNull().default(''),
  notes: text('notes').notNull().default(''),
  createdAt: text('created_at').notNull()
})
