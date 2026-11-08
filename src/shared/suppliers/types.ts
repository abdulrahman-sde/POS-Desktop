import type { z } from 'zod'

import type { addSupplierSchema, updateSupplierSchema } from './schema'
import type { suppliers } from './table'

export type Supplier = typeof suppliers.$inferSelect

export type AddSupplierInput = z.infer<typeof addSupplierSchema>
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>
