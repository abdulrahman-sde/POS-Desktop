import { desc, eq, sql } from 'drizzle-orm'

import { customers } from '@shared/schema'
import type { DbOrTx } from '../../db/connection'

export const listCustomers = (db: DbOrTx) =>
  db
    .select()
    .from(customers)
    .orderBy(desc(sql`rowid`))
    .all()

export const findCustomerById = (db: DbOrTx, id: string) =>
  db.select().from(customers).where(eq(customers.id, id)).get()

export const insertCustomer = (db: DbOrTx, row: typeof customers.$inferInsert) =>
  db.insert(customers).values(row).returning().get()

export const updateCustomerRow = (
  db: DbOrTx,
  id: string,
  patch: Partial<typeof customers.$inferInsert>
) => db.update(customers).set(patch).where(eq(customers.id, id)).returning().get()
