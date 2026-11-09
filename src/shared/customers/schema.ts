import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { moneyFromZero } from '../money'
import { customers } from './table'

const customerFields = createInsertSchema(customers, {
  name: (s) => s.trim().min(1, 'Enter the customer name.').max(120, 'The name is too long.'),
  phone: (s) =>
    s
      .trim()
      .refine(
        (value) => value === '' || value.replace(/\D/g, '').length >= 10,
        'Phone number looks too short.'
      ),
  address: (s) => s.trim().max(200, 'The address is too long.'),
  notes: (s) => s.trim().max(500, 'The notes are too long.'),
  openingBalance: moneyFromZero('The amount cannot be below 0.').optional()
}).omit({ id: true, createdAt: true })

export const addCustomerSchema = customerFields

export const updateCustomerSchema = customerFields.partial().extend({ id: z.string().min(1) })
