import type { NewPurchaseInput, PaySupplierInput } from '@shared/purchases/types'

export const purchasesApi = {
  list: () => window.api.purchases.list(),
  create: (input: NewPurchaseInput) => window.api.purchases.create(input),
  listSupplierPayments: () => window.api.purchases.listSupplierPayments(),
  paySupplier: (input: PaySupplierInput) => window.api.purchases.paySupplier(input)
}
