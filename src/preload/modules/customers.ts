import type { AddCustomerInput, Customer, UpdateCustomerInput } from '@shared/customers/types'
import { call } from './call'

export const customersPreload = {
  list: () => call<Customer[]>('customers:list'),
  add: (input: AddCustomerInput) => call<Customer>('customers:add', input),
  update: (input: UpdateCustomerInput) => call<Customer>('customers:update', input),
  remove: (id: string) => call<void>('customers:remove', { id })
}
