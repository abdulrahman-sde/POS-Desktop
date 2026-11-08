import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { isMoney, MONEY_DECIMALS_MESSAGE } from '../money'
import { settings } from './table'

export const saveSettingsSchema = createInsertSchema(settings, {
  shopName: (s) => s.trim().min(1, 'Enter the shop name.').max(120, 'The shop name is too long.'),
  ownerName: (s) => s.trim().max(120, 'The name is too long.'),
  phone: (s) =>
    s
      .trim()
      .refine(
        (v) => v === '' || v.replace(/\D/g, '').length >= 10,
        'Phone number looks too short.'
      ),
  address: (s) => s.trim().max(200, 'The address is too long.'),
  countryCode: (s) => s.trim().regex(/^\d{1,4}$/, 'Use only numbers, like 92.'),
  invoiceNote: (s) => s.trim().max(500, 'The note is too long.'),
  defaultReorderLevel: z
    .number({ error: 'Enter a whole number, like 5.' })
    .int('Enter a whole number, like 5.')
    .min(0, 'This cannot be below 0.')
    .max(100000, 'This number is too big.'),
  defaultMarkupPercent: z
    .number({ error: 'Enter a percentage, like 15.' })
    .min(0, 'This cannot be below 0.')
    .max(1000, 'This number is too big.')
    .refine(isMoney, MONEY_DECIMALS_MESSAGE)
}).omit({ id: true })
