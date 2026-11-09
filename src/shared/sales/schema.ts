import { z } from 'zod'

import { moneyAboveZero, moneyFromZero } from '../money'
import { paymentMethods } from './constants'

export const orderItemInputSchema = z.object({
  productId: z.string().min(1),
  qty: z.number({ error: 'Enter how many.' }).int('Use whole numbers.').positive('Enter how many.'),
  unitPrice: moneyAboveZero('Type a price for every item.'),
  // Only for this invoice line. The product keeps its own name.
  name: z.string().trim().max(120, 'The item name is too long.').optional()
})

export const createOrderSchema = z.object({
  customerId: z.string().min(1).nullable(),
  items: z.array(orderItemInputSchema).min(1, 'Add at least one product.'),
  discount: moneyFromZero('The discount cannot be below 0.').default(0),
  advance: moneyFromZero('Money received cannot be below 0.').default(0),
  method: z.enum(paymentMethods),
  note: z.string().trim().max(500, 'The note is too long.').default('')
})
