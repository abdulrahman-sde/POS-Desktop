import { and, desc, eq, isNull, sql } from 'drizzle-orm'

import { suppliers } from '@shared/schema'
import type { DbOrTx } from '../../db/connection'

export const listSuppliers = (db: DbOrTx) =>
  db
    .select()
    .from(suppliers)
    .orderBy(desc(sql`rowid`))
    .all()

export const findActiveSupplierById = (db: DbOrTx, id: string) =>
  db
    .select()
    .from(suppliers)
    .where(and(eq(suppliers.id, id), isNull(suppliers.deletedAt)))
    .get()

export const findActiveSupplierByName = (db: DbOrTx, name: string) =>
  db
    .select()
    .from(suppliers)
    .where(and(sql`lower(${suppliers.name}) = lower(${name})`, isNull(suppliers.deletedAt)))
    .get()

export const insertSupplier = (db: DbOrTx, row: typeof suppliers.$inferInsert) =>
  db.insert(suppliers).values(row).returning().get()

export const updateSupplierRow = (
  db: DbOrTx,
  id: string,
  patch: Partial<typeof suppliers.$inferInsert>
) => db.update(suppliers).set(patch).where(eq(suppliers.id, id)).returning().get()

export const softDeleteSupplier = (db: DbOrTx, id: string, deletedAt: string) =>
  db.update(suppliers).set({ deletedAt }).where(eq(suppliers.id, id)).run()
