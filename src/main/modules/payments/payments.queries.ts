import { desc, eq, sql } from 'drizzle-orm'

import { payments } from '@shared/schema'
import type { DbOrTx } from '../../db/connection'

export const listPayments = (db: DbOrTx) =>
  db
    .select()
    .from(payments)
    .orderBy(desc(payments.date), desc(sql`rowid`))
    .all()

export const insertPayment = (db: DbOrTx, row: typeof payments.$inferInsert) =>
  db.insert(payments).values(row).returning().get()

export const sumPaidByCustomer = (db: DbOrTx, customerId: string): number =>
  db
    .select({ n: sql<number>`coalesce(sum(${payments.amount}), 0)` })
    .from(payments)
    .where(eq(payments.customerId, customerId))
    .get()?.n ?? 0
