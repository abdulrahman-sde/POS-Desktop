import { z } from 'zod'

import { paymentMethods } from '../sales/constants'

export const recordPaymentSchema = z.object({
  customerId: z.string().min(1, 'Choose a customer.'),
  amount: z
    .number({ error: 'Enter an amount greater than zero.' })
    .int('Use whole rupees, with no decimals.')
    .positive('Enter an amount greater than zero.'),
  method: z.enum(paymentMethods),
  note: z.string().trim().max(500, 'The note is too long.').default('')
})
