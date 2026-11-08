import type { RecordPaymentInput } from '@shared/payments/types'

export const paymentsApi = {
  list: () => window.api.payments.list(),
  record: (input: RecordPaymentInput) => window.api.payments.record(input)
}
