import { desc, eq, sql } from 'drizzle-orm'

import { orderItems, orders } from '@shared/schema'
import type { DbOrTx } from '../../db/connection'

export const listOrders = (db: DbOrTx) =>
  db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt), desc(sql`rowid`))
    .all()

export const listOrderItems = (db: DbOrTx) => db.select().from(orderItems).all()

export const findOrderById = (db: DbOrTx, id: string) =>
  db.select().from(orders).where(eq(orders.id, id)).get()

export const listItemsOfOrder = (db: DbOrTx, orderId: string) =>
  db.select().from(orderItems).where(eq(orderItems.orderId, orderId)).all()

export const highestInvoiceNumber = (db: DbOrTx): number =>
  db
    .select({ n: sql<number | null>`max(cast(substr(${orders.invoiceNo}, 5) as integer))` })
    .from(orders)
    .get()?.n ?? 0

export const insertOrder = (db: DbOrTx, row: typeof orders.$inferInsert) =>
  db.insert(orders).values(row).run()

export const insertOrderItem = (db: DbOrTx, row: typeof orderItems.$inferInsert) =>
  db.insert(orderItems).values(row).run()

export const unpaidAtSale = (db: DbOrTx, customerId: string): number =>
  db.get<{ n: number }>(sql`
    select coalesce(sum(total - min(advance, total)), 0) as n
    from (
      select
        max(0, coalesce((select sum(qty * unit_price) from order_items where order_id = o.id), 0) - o.discount) as total,
        o.advance as advance
      from orders o
      where o.customer_id = ${customerId}
    )
  `)?.n ?? 0
