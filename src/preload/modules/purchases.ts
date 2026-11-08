import type {
  NewPurchaseInput,
  PaySupplierInput,
  Purchase,
  SupplierPayment
} from '@shared/purchases/types'
import { call } from './call'

export const purchasesPreload = {
  list: () => call<Purchase[]>('purchases:list'),
  create: (input: NewPurchaseInput) => call<Purchase>('purchases:create', input),
  listSupplierPayments: () => call<SupplierPayment[]>('purchases:listSupplierPayments'),
  paySupplier: (input: PaySupplierInput) => call<SupplierPayment>('purchases:paySupplier', input)
}
