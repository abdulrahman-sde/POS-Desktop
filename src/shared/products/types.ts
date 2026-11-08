import type { z } from 'zod'

import type { products } from './table'
import type { addProductSchema, addStockSchema, updateProductSchema } from './schema'

// A product row exactly as the database holds it.
export type ProductRow = typeof products.$inferSelect

// A product as the screens use it: the row plus the category NAME, looked up from categoryId.
export type Product = ProductRow & { category: string }

export type AddProductInput = z.infer<typeof addProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type AddStockInput = z.infer<typeof addStockSchema>
