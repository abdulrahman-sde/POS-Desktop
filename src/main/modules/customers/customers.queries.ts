import { and, desc, eq, isNotNull, isNull, sql } from 'drizzle-orm'

import { customers } from '@shared/schema'
import type { DbOrTx } from '../../db/connection'

export const listCustomers = (db: DbOrTx) =>
  db
    .select()
    .from(customers)
    .orderBy(desc(sql`rowid`))
    .all()

export const findActiveCustomerById = (db: DbOrTx, id: string) =>
  db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), isNull(customers.deletedAt)))
    .get()

export const insertCustomer = (db: DbOrTx, row: typeof customers.$inferInsert) =>
  db.insert(customers).values(row).returning().get()

export const updateCustomerRow = (
  db: DbOrTx,
  id: string,
  patch: Partial<typeof customers.$inferInsert>
) => db.update(customers).set(patch).where(eq(customers.id, id)).returning().get()

export const softDeleteCustomer = (db: DbOrTx, id: string, deletedAt: string) =>
  db.update(customers).set({ deletedAt }).where(eq(customers.id, id)).run()

export const listDeletedCustomers = (db: DbOrTx) =>
  db
    .select()
    .from(customers)
    .where(isNotNull(customers.deletedAt))
    .orderBy(desc(customers.deletedAt))
    .all()

export const findDeletedCustomerById = (db: DbOrTx, id: string) =>
  db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), isNotNull(customers.deletedAt)))
    .get()

export const restoreCustomerRow = (db: DbOrTx, id: string) =>
  db.update(customers).set({ deletedAt: null }).where(eq(customers.id, id)).run()
