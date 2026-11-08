import { createPurchaseSchema, paySupplierSchema } from '@shared/purchases/schema'
import { handle } from '../../lib/ipc'
import * as service from './purchases.service'

export function registerPurchasesIpc(): void {
  handle('purchases:list', null, () => service.listPurchases())
  handle('purchases:create', createPurchaseSchema, (input) => service.createPurchase(input))
  handle('purchases:listSupplierPayments', null, () => service.listSupplierPayments())
  handle('purchases:paySupplier', paySupplierSchema, (input) => service.paySupplier(input))
}
