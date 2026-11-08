import type { z } from 'zod'

import type { recordPaymentSchema } from './schema'
import type { payments } from './table'

export type Payment = typeof payments.$inferSelect

export type RecordPaymentInput = z.input<typeof recordPaymentSchema>
export type CreatePaymentInput = z.output<typeof recordPaymentSchema>
