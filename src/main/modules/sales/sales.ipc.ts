import { createOrderSchema } from '@shared/sales/schema'
import { handle } from '../../lib/ipc'
import * as service from './sales.service'

export function registerSalesIpc(): void {
  handle('sales:listOrders', null, () => service.listOrders())
  handle('sales:createOrder', createOrderSchema, (input) => service.createOrder(input))
}
