import { addCustomerSchema, updateCustomerSchema } from '@shared/customers/schema'
import { idSchema } from '@shared/common'
import { handle } from '../../lib/ipc'
import * as service from './customers.service'

export function registerCustomersIpc(): void {
  handle('customers:list', null, () => service.listCustomers())
  handle('customers:add', addCustomerSchema, (input) => service.addCustomer(input))
  handle('customers:update', updateCustomerSchema, (input) => service.updateCustomer(input))
  handle('customers:remove', idSchema, ({ id }) => service.deleteCustomer(id))
}
