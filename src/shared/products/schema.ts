import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { products } from './table'

// The rules for product input, generated from the table and then given plain-language messages.
// The Add product form and the backend both use these, so the owner sees the same words either way.
const productFields = createInsertSchema(products, {
  name: (s) => s.trim().min(1, 'Enter the product name.').max(120, 'The product name is too long.'),
  categoryId: (s) => s.min(1, 'Choose a category, or add a new one with the + button.'),
  brand: (s) => s.trim().max(60, 'The brand is too long.'),
  shelf: (s) => s.trim().max(30, 'The shelf name is too long.'),
  costPrice: z
    .number({ error: 'Enter the cost price.' })
    .int('Use whole rupees, with no decimals.')
    .positive('Enter the cost price.'),
  // Optional: when it is empty the backend uses the cost price plus 15%.
  salePrice: z
    .number({ error: 'Enter a selling price, or leave it empty.' })
    .int('Use whole rupees, with no decimals.')
    .positive('Enter a selling price, or leave it empty.')
    .optional(),
  stock: (s) => s.int('Use whole numbers.').min(0, 'Stock cannot be below 0.'),
  reorderLevel: (s) => s.int('Use whole numbers.').min(0, 'This cannot be below 0.')
}).omit({ id: true, itemCode: true, createdAt: true })

// What the Add product form sends.
export const addProductSchema = productFields

// What the Edit product form sends: the id, plus any fields that changed.
export const updateProductSchema = productFields.partial().extend({ id: z.string().min(1) })

// The "Add stock" button on a product.
export const addStockSchema = z.object({
  id: z.string().min(1),
  qty: z
    .number({ error: 'Enter how many units arrived.' })
    .int('Use whole numbers.')
    .positive('Enter how many units arrived.')
})
