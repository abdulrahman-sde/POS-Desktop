import { recordPaymentSchema } from '@shared/payments/schema'
import { handle } from '../../lib/ipc'
import * as service from './payments.service'

export function registerPaymentsIpc(): void {
  handle('payments:list', null, () => service.listPayments())
  handle('payments:record', recordPaymentSchema, (input) => service.recordPayment(input))
}
