import { z } from 'zod'

import { paymentMethods } from '../sales/constants'

const whole = 'Use whole rupees, with no decimals.'

export const purchaseItemInputSchema = z.object({
  productId: z.string().min(1),
  qty: z.number({ error: 'Enter how many.' }).int('Use whole numbers.').positive('Enter how many.'),
  costPrice: z
    .number({ error: 'Type the cost for every item.' })
    .int(whole)
    .positive('Type the cost for every item.')
})

export const createPurchaseSchema = z.object({
  supplierId: z.string().min(1, 'Choose a supplier.'),
  items: z.array(purchaseItemInputSchema).min(1, 'Add at least one product.'),
  paid: z.number().int(whole).min(0, 'Money paid cannot be below 0.').default(0),
  method: z.enum(paymentMethods),
  note: z.string().trim().max(500, 'The note is too long.').default('')
})

export const paySupplierSchema = z.object({
  supplierId: z.string().min(1, 'Choose a supplier.'),
  amount: z
    .number({ error: 'Enter how much you paid.' })
    .int(whole)
    .positive('Enter how much you paid.'),
  method: z.enum(paymentMethods),
  note: z.string().trim().max(500, 'The note is too long.').default('')
})
