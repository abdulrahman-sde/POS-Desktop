import { z } from 'zod'

import { moneyAboveZero, moneyFromZero } from '../money'
import { addProductSchema } from '../products/schema'
import { paymentMethods } from '../sales/constants'

// A product that does not exist yet and is made when the bill is saved (from an imported invoice). Its cost price is
// the cost on the bill line.
export const newBillProductSchema = addProductSchema
  .pick({ name: true, brand: true, shelf: true, salePrice: true, reorderLevel: true })
  .extend({
    category: z
      .string()
      .trim()
      .min(1, 'Enter the category name.')
      .max(60, 'The category name is too long.')
  })

export const purchaseItemInputSchema = z
  .object({
    productId: z.string().min(1).optional(),
    newProduct: newBillProductSchema.optional(),
    qty: z
      .number({ error: 'Enter how many.' })
      .int('Use whole numbers.')
      .positive('Enter how many.'),
    costPrice: moneyAboveZero('Type the cost for every item.')
  })
  .refine((item) => (item.productId === undefined) !== (item.newProduct === undefined), {
    message: 'Each item is either one of your products or a new product.'
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
