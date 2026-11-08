import type { z } from 'zod'

import type { addCustomerSchema, updateCustomerSchema } from './schema'
import type { customers } from './table'

export type Customer = typeof customers.$inferSelect

export type AddCustomerInput = z.infer<typeof addCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>
