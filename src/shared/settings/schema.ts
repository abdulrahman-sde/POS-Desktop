import { createInsertSchema } from 'drizzle-zod'

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
  invoiceNote: (s) => s.trim().max(500, 'The note is too long.')
}).omit({ id: true })
