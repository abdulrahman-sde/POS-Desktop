import { sql } from 'drizzle-orm'
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { products } from '../products/table'
import { paymentMethods } from '../sales/constants'
import { suppliers } from '../suppliers/table'

export const purchases = sqliteTable(
  'purchases',
  {
    id: text('id').primaryKey(),
    billNo: text('bill_no').notNull().unique(),
    supplierId: text('supplier_id')
      .notNull()
      .references(() => suppliers.id),
    paid: integer('paid').notNull().default(0),
    method: text('method', { enum: paymentMethods }).notNull(),
    note: text('note').notNull().default(''),
    createdAt: text('created_at').notNull()
  },
  (t) => [check('purchases_paid_not_negative', sql`${t.paid} >= 0`)]
)

export const purchaseItems = sqliteTable(
  'purchase_items',
  {
    id: text('id').primaryKey(),
    purchaseId: text('purchase_id')
      .notNull()
      .references(() => purchases.id),
    productId: text('product_id')
      .notNull()
      .references(() => products.id),
    name: text('name').notNull(),
    qty: integer('qty').notNull(),
    costPrice: integer('cost_price').notNull()
  },
  (t) => [
    check('purchase_items_qty_positive', sql`${t.qty} > 0`),
    check('purchase_items_cost_price_positive', sql`${t.costPrice} > 0`)
  ]
)

export const supplierPayments = sqliteTable(
  'supplier_payments',
  {
    id: text('id').primaryKey(),
    supplierId: text('supplier_id')
      .notNull()
      .references(() => suppliers.id),
    amount: integer('amount').notNull(),
    method: text('method', { enum: paymentMethods }).notNull(),
    note: text('note').notNull().default(''),
    date: text('date').notNull()
  },
  (t) => [check('supplier_payments_amount_positive', sql`${t.amount} > 0`)]
)
