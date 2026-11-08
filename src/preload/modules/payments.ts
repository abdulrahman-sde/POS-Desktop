import type { Payment, RecordPaymentInput } from '@shared/payments/types'
import { call } from './call'

export const paymentsPreload = {
  list: () => call<Payment[]>('payments:list'),
  record: (input: RecordPaymentInput) => call<Payment>('payments:record', input)
}
