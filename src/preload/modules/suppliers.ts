import type { AddSupplierInput, Supplier, UpdateSupplierInput } from '@shared/suppliers/types'
import { call } from './call'

export const suppliersPreload = {
  list: () => call<Supplier[]>('suppliers:list'),
  add: (input: AddSupplierInput) => call<Supplier>('suppliers:add', input),
  update: (input: UpdateSupplierInput) => call<Supplier>('suppliers:update', input),
  remove: (id: string) => call<void>('suppliers:remove', { id })
}
