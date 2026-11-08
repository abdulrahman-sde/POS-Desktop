import { sql } from 'drizzle-orm'
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { customers } from '../customers/table'
import { products } from '../products/table'
import { paymentMethods } from './constants'

export const orders = sqliteTable(
  'orders',
  {
    id: text('id').primaryKey(),
    invoiceNo: text('invoice_no').notNull().unique(),
    customerId: text('customer_id').references(() => customers.id),
    discount: integer('discount').notNull().default(0),
    advance: integer('advance').notNull().default(0),
    method: text('method', { enum: paymentMethods }).notNull(),
    note: text('note').notNull().default(''),
    createdAt: text('created_at').notNull()
  },
  (t) => [
    check('orders_discount_not_negative', sql`${t.discount} >= 0`),
    check('orders_advance_not_negative', sql`${t.advance} >= 0`)
  ]
)

export const orderItems = sqliteTable(
  'order_items',
  {
    id: text('id').primaryKey(),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id),
    productId: text('product_id')
      .notNull()
      .references(() => products.id),
    name: text('name').notNull(),
    qty: integer('qty').notNull(),
    unitPrice: integer('unit_price').notNull(),
    costPrice: integer('cost_price').notNull()
  },
  (t) => [
    check('order_items_qty_positive', sql`${t.qty} > 0`),
    check('order_items_unit_price_positive', sql`${t.unitPrice} > 0`),
    check('order_items_cost_price_positive', sql`${t.costPrice} > 0`)
  ]
)
