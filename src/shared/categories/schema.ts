import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { categories } from './table'

// The rules for category input. These plain-language messages are shown to the owner both by
// the form (renderer) and by the backend (main), so they are written once, here.
const categoryFields = createInsertSchema(categories, {
  name: (s) => s.trim().min(1, 'Enter the category name.').max(60, 'The category name is too long.')
})

export const addCategorySchema = categoryFields.pick({ name: true })

export const renameCategorySchema = categoryFields
  .pick({ name: true })
  .extend({ id: z.string().min(1) })

export const categoryIdSchema = z.object({ id: z.string().min(1) })
