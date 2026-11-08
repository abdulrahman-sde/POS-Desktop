import type { AddCustomerInput, UpdateCustomerInput } from '@shared/customers/types'

export const customersApi = {
  list: () => window.api.customers.list(),
  add: (input: AddCustomerInput) => window.api.customers.add(input),
  update: (input: UpdateCustomerInput) => window.api.customers.update(input),
  remove: (id: string) => window.api.customers.remove(id)
}
