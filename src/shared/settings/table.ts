import { sql } from 'drizzle-orm'
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const settings = sqliteTable(
  'settings',
  {
    id: integer('id').primaryKey(),
    shopName: text('shop_name').notNull(),
    ownerName: text('owner_name').notNull(),
    phone: text('phone').notNull(),
    address: text('address').notNull(),
    countryCode: text('country_code').notNull(),
    invoiceNote: text('invoice_note').notNull()
  },
  (t) => [check('settings_single_row', sql`${t.id} = 1`)]
)
