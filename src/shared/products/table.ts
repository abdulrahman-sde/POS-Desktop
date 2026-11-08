import { sql } from 'drizzle-orm'
import { check, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

import { categories } from '../categories/table'
import { partQualities } from './constants'

export const products = sqliteTable(
  'products',
  {
    id: text('id').primaryKey(),
    // Made automatically (ITM-0001, ITM-0002 ...). Shown on screen and used by barcode scanners.
    itemCode: text('item_code').notNull().unique(),
    name: text('name').notNull(),
    // Points at the categories table, so renaming a category needs no change on its products.
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id),
    brand: text('brand').notNull().default(''),
    quality: text('quality', { enum: partQualities }), // optional: empty means not set
    shelf: text('shelf').notNull().default(''),
    // Money is whole PKR rupees stored as integers.
    costPrice: integer('cost_price').notNull(),
    salePrice: integer('sale_price').notNull(),
    stock: integer('stock').notNull().default(0),
    reorderLevel: integer('reorder_level').notNull().default(5),
    createdAt: text('created_at').notNull()
  },
  (t) => [
    // Two products cannot share a name, even if the capital letters differ (the invoice import matches by name).
    uniqueIndex('products_name_unique').on(sql`lower(${t.name})`),
    // The database itself refuses nonsense, as a last line of defence.
    check('products_cost_price_positive', sql`${t.costPrice} > 0`),
    check('products_sale_price_positive', sql`${t.salePrice} > 0`),
    check('products_stock_not_negative', sql`${t.stock} >= 0`)
  ]
)
