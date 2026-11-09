import type { PaymentMethod } from '@shared/sales/constants'
import type { Order, OrderItemRow } from '@shared/sales/types'

export type { Order, PaymentMethod }

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: 'Cash',
  bank: 'Bank transfer',
  wallet: 'Mobile wallet'
}

export type OrderItem = Pick<OrderItemRow, 'productId' | 'name' | 'qty' | 'unitPrice' | 'costPrice'>

// A line in the New Sale cart. `name` is what the invoice will say; `productName` is the product's own name.
export type CartItem = OrderItem & { productName: string }

export type CartLineNameProps = {
  name: string
  productName: string
  onChange: (name: string) => void
}

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
