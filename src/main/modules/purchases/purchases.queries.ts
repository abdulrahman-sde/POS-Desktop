import { desc, sql } from 'drizzle-orm'

import { purchaseItems, purchases, supplierPayments } from '@shared/schema'
import type { DbOrTx } from '../../db/connection'

export const listPurchases = (db: DbOrTx) =>
  db
    .select()
    .from(purchases)
    .orderBy(desc(purchases.createdAt), desc(sql`rowid`))
    .all()

export const listPurchaseItems = (db: DbOrTx) => db.select().from(purchaseItems).all()

export const findPurchaseById = (db: DbOrTx, id: string) =>
  db
    .select()
    .from(purchases)
    .where(sql`${purchases.id} = ${id}`)
    .get()

export const listItemsOfPurchase = (db: DbOrTx, purchaseId: string) =>
  db
    .select()
    .from(purchaseItems)
    .where(sql`${purchaseItems.purchaseId} = ${purchaseId}`)
    .all()

export const highestBillNumber = (db: DbOrTx): number =>
  db
    .select({ n: sql<number | null>`max(cast(substr(${purchases.billNo}, 6) as integer))` })
    .from(purchases)
    .get()?.n ?? 0

export const insertPurchase = (db: DbOrTx, row: typeof purchases.$inferInsert) =>
  db.insert(purchases).values(row).run()

export const insertPurchaseItem = (db: DbOrTx, row: typeof purchaseItems.$inferInsert) =>
  db.insert(purchaseItems).values(row).run()

export const listSupplierPayments = (db: DbOrTx) =>
  db
    .select()
    .from(supplierPayments)
    .orderBy(desc(supplierPayments.date), desc(sql`rowid`))
    .all()

export const insertSupplierPayment = (db: DbOrTx, row: typeof supplierPayments.$inferInsert) =>
  db.insert(supplierPayments).values(row).returning().get()

export const owedToSupplier = (db: DbOrTx, supplierId: string): number => {
  const billed =
    db.get<{ n: number }>(sql`
      select coalesce(sum(total - paid), 0) as n
      from (
        select
          coalesce((select sum(qty * cost_price) from purchase_items where purchase_id = p.id), 0) as total,
          p.paid as paid
        from purchases p
        where p.supplier_id = ${supplierId}
      )
    `)?.n ?? 0
  const paid =
    db.get<{ n: number }>(sql`
      select coalesce(sum(amount), 0) as n from supplier_payments where supplier_id = ${supplierId}
    `)?.n ?? 0
  return billed - paid
}
