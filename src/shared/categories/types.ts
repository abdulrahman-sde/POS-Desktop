import type { z } from 'zod'

import type { categories } from './table'
import type { addCategorySchema, renameCategorySchema } from './schema'

// A saved category, exactly as the database holds it.
export type Category = typeof categories.$inferSelect

export type AddCategoryInput = z.infer<typeof addCategorySchema>
export type RenameCategoryInput = z.infer<typeof renameCategorySchema>

// Where things go when they have no category (for example an invoice line that sits under no heading).
export const OTHERS_CATEGORY = 'Others'
