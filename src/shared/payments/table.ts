import { sql } from 'drizzle-orm'
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { customers } from '../customers/table'
import { paymentMethods } from '../sales/constants'

export const payments = sqliteTable(
  'payments',
  {
    id: text('id').primaryKey(),
    customerId: text('customer_id')
      .notNull()
      .references(() => customers.id),
    amount: integer('amount').notNull(),
    method: text('method', { enum: paymentMethods }).notNull(),
    note: text('note').notNull().default(''),
    date: text('date').notNull()
  },
  (t) => [check('payments_amount_positive', sql`${t.amount} > 0`)]
)
