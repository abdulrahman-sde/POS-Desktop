import { z } from 'zod'

import { moneyAboveZero, moneyFromZero } from '../money'
import { paymentMethods } from '../sales/constants'

export const purchaseItemInputSchema = z.object({
  productId: z.string().min(1),
  qty: z.number({ error: 'Enter how many.' }).int('Use whole numbers.').positive('Enter how many.'),
  costPrice: moneyAboveZero('Type the cost for every item.')
})

export const createPurchaseSchema = z.object({
  supplierId: z.string().min(1, 'Choose a supplier.'),
  items: z.array(purchaseItemInputSchema).min(1, 'Add at least one product.'),
  paid: moneyFromZero('Money paid cannot be below 0.').default(0),
  method: z.enum(paymentMethods),
  note: z.string().trim().max(500, 'The note is too long.').default('')
})

export const paySupplierSchema = z.object({
  supplierId: z.string().min(1, 'Choose a supplier.'),
  amount: moneyAboveZero('Enter how much you paid.'),
  method: z.enum(paymentMethods),
  note: z.string().trim().max(500, 'The note is too long.').default('')
})
