import { eq, sql } from 'drizzle-orm'

import { categories, products } from '@shared/schema'
import type { DbOrTx } from '../../db/connection'

// Only SQL lives here. No rules and no decisions: those are in categories.service.ts.

// Oldest first. The colour of a category chip depends on its place in this list.
export const listCategories = (db: DbOrTx) =>
  db
    .select()
    .from(categories)
    .orderBy(sql`rowid`)
    .all()

export const findCategoryById = (db: DbOrTx, id: string) =>
  db.select().from(categories).where(eq(categories.id, id)).get()

export const findCategoryByName = (db: DbOrTx, name: string) =>
  db
    .select()
    .from(categories)
    .where(sql`lower(${categories.name}) = lower(${name})`)
    .get()

export const insertCategory = (db: DbOrTx, row: typeof categories.$inferInsert) =>
  db.insert(categories).values(row).returning().get()

export const updateCategoryName = (db: DbOrTx, id: string, name: string) =>
  db.update(categories).set({ name }).where(eq(categories.id, id)).returning().get()

export const deleteCategoryRow = (db: DbOrTx, id: string) =>
  db.delete(categories).where(eq(categories.id, id)).run()

export const countProductsInCategory = (db: DbOrTx, id: string) =>
  db
    .select({ n: sql<number>`count(*)` })
    .from(products)
    .where(eq(products.categoryId, id))
    .get()?.n ?? 0
