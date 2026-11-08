import { and, desc, eq, gte, sql } from 'drizzle-orm'

import { categories, products } from '@shared/schema'
import type { DbOrTx } from '../../db/connection'

// Only SQL lives here. No rules and no decisions: those are in products.service.ts.

// A product together with its category NAME (looked up from categoryId).
const withCategory = {
  id: products.id,
  itemCode: products.itemCode,
  name: products.name,
  categoryId: products.categoryId,
  category: categories.name,
  brand: products.brand,
  quality: products.quality,
  shelf: products.shelf,
  costPrice: products.costPrice,
  salePrice: products.salePrice,
  stock: products.stock,
  reorderLevel: products.reorderLevel,
  createdAt: products.createdAt
}

// Newest first.
export const listProducts = (db: DbOrTx) =>
  db
    .select(withCategory)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(sql`${products}.rowid`))
    .all()

export const findProductById = (db: DbOrTx, id: string) =>
  db
    .select(withCategory)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id))
    .get()

export const findProductByName = (db: DbOrTx, name: string) =>
  db
    .select({ id: products.id })
    .from(products)
    .where(sql`lower(${products.name}) = lower(${name})`)
    .get()

// The biggest number used in an item code so far (ITM-0007 gives 7).
export const highestItemNumber = (db: DbOrTx): number =>
  db
    .select({ n: sql<number | null>`max(cast(substr(${products.itemCode}, 5) as integer))` })
    .from(products)
    .get()?.n ?? 0

export const insertProduct = (db: DbOrTx, row: typeof products.$inferInsert) =>
  db.insert(products).values(row).run()

export const updateProductRow = (
  db: DbOrTx,
  id: string,
  patch: Partial<typeof products.$inferInsert>
) => db.update(products).set(patch).where(eq(products.id, id)).run()

export const increaseStock = (db: DbOrTx, id: string, qty: number) =>
  db
    .update(products)
    .set({ stock: sql`${products.stock} + ${qty}` })
    .where(eq(products.id, id))
    .run()

export const decreaseStock = (db: DbOrTx, id: string, qty: number) =>
  db
    .update(products)
    .set({ stock: sql`${products.stock} - ${qty}` })
    .where(and(eq(products.id, id), gte(products.stock, qty)))
    .run().changes
