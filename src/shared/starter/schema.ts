import { z } from 'zod'

import { addCustomerSchema } from '../customers/schema'
import { addProductSchema } from '../products/schema'
import { addSupplierSchema } from '../suppliers/schema'
import { tidyPhone } from '../phone'

const withTidyPhone = <T extends { phone?: string }>(row: T): T =>
  row.phone === undefined ? row : { ...row, phone: tidyPhone(row.phone) }

const starterProduct = addProductSchema.pick({ name: true, costPrice: true }).extend({
  category: z
    .string()
    .trim()
    .min(1, 'Enter the category name.')
    .max(60, 'The category name is too long.'),
  quantity: z.number().int('Use whole numbers.').min(0, 'Stock cannot be below 0.').default(0)
})

// The one-time starting data file. Each row follows the same rules as the Add forms.
export const starterFileSchema = z.object({
  version: z.literal(1, { error: 'This is not a Stockwise starting data file.' }),
  customers: z.array(addCustomerSchema.transform(withTidyPhone)).default([]),
  suppliers: z.array(addSupplierSchema.transform(withTidyPhone)).default([]),
  products: z.array(starterProduct).default([])
})
