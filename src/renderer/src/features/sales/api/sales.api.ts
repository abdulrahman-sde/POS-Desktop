import type { NewOrderInput } from '@shared/sales/types'

export const salesApi = {
  listOrders: () => window.api.sales.listOrders(),
  createOrder: (input: NewOrderInput) => window.api.sales.createOrder(input)
}
