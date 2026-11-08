import { z } from 'zod'

import { moneyAboveZero } from '../money'
import { paymentMethods } from '../sales/constants'

export const recordPaymentSchema = z.object({
  customerId: z.string().min(1, 'Choose a customer.'),
  amount: moneyAboveZero('Enter an amount greater than zero.'),
  method: z.enum(paymentMethods),
  note: z.string().trim().max(500, 'The note is too long.').default('')
})
