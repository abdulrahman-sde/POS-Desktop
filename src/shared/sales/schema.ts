import { z } from 'zod'

import { paymentMethods } from './constants'

const whole = 'Use whole rupees, with no decimals.'

export const orderItemInputSchema = z.object({
  productId: z.string().min(1),
  qty: z.number({ error: 'Enter how many.' }).int('Use whole numbers.').positive('Enter how many.'),
  unitPrice: z
    .number({ error: 'Type a price for every item.' })
    .int(whole)
    .positive('Type a price for every item.')
})

export const createOrderSchema = z.object({
  customerId: z.string().min(1).nullable(),
  items: z.array(orderItemInputSchema).min(1, 'Add at least one product.'),
  discount: z.number().int(whole).min(0, 'The discount cannot be below 0.').default(0),
  advance: z.number().int(whole).min(0, 'Money received cannot be below 0.').default(0),
  method: z.enum(paymentMethods),
  note: z.string().trim().max(500, 'The note is too long.').default('')
})
