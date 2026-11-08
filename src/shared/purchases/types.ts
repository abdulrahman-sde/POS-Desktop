import type { z } from 'zod'

import type { createPurchaseSchema, paySupplierSchema } from './schema'
import type { purchaseItems, purchases, supplierPayments } from './table'

export type PurchaseRow = typeof purchases.$inferSelect
export type PurchaseItemRow = typeof purchaseItems.$inferSelect

export type Purchase = PurchaseRow & { items: PurchaseItemRow[] }
export type SupplierPayment = typeof supplierPayments.$inferSelect

export type NewPurchaseInput = z.input<typeof createPurchaseSchema>
export type CreatePurchaseInput = z.output<typeof createPurchaseSchema>
export type PaySupplierInput = z.input<typeof paySupplierSchema>
export type CreateSupplierPaymentInput = z.output<typeof paySupplierSchema>
