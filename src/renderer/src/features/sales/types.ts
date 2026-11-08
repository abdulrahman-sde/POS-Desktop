import type { PaymentMethod } from '@shared/sales/constants'
import type { Order, OrderItemRow } from '@shared/sales/types'

export type { Order, PaymentMethod }

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: 'Cash',
  bank: 'Bank transfer',
  wallet: 'Mobile wallet'
}

export type OrderItem = Pick<OrderItemRow, 'productId' | 'name' | 'qty' | 'unitPrice' | 'costPrice'>

export type OrdersResult = {
  orders: Order[]
  isLoading: boolean
}

export type InvoiceStatus = 'paid' | 'partial' | 'unpaid'

export type InvoiceSummary = {
  total: number
  paid: number
  due: number
  status: InvoiceStatus
}
