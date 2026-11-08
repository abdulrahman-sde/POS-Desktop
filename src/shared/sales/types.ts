import type { z } from 'zod'

import type { createOrderSchema } from './schema'
import type { orderItems, orders } from './table'

export type OrderRow = typeof orders.$inferSelect
export type OrderItemRow = typeof orderItems.$inferSelect

export type Order = OrderRow & { items: OrderItemRow[] }

export type NewOrderInput = z.input<typeof createOrderSchema>
export type CreateOrderInput = z.output<typeof createOrderSchema>
