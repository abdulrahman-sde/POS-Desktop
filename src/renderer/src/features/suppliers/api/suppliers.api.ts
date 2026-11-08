import type { AddSupplierInput, UpdateSupplierInput } from '@shared/suppliers/types'

export const suppliersApi = {
  list: () => window.api.suppliers.list(),
  add: (input: AddSupplierInput) => window.api.suppliers.add(input),
  update: (input: UpdateSupplierInput) => window.api.suppliers.update(input),
  remove: (id: string) => window.api.suppliers.remove(id)
}
