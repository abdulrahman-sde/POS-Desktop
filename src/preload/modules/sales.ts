import type { NewOrderInput, Order } from '@shared/sales/types'
import { call } from './call'

export const salesPreload = {
  listOrders: () => call<Order[]>('sales:listOrders'),
  createOrder: (input: NewOrderInput) => call<Order>('sales:createOrder', input)
}
