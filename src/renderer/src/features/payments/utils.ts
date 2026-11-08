import { paymentMethodLabels, type Order, type PaymentMethod } from '@/features/sales/types'
import { orderTotal } from '@/features/sales/utils'
import type { Payment } from './types'

// One line of money received: either paid when the sale was made, or paid later.
export type Receipt = {
  id: string
  date: string
  customerId: string | null // null = walk-in customer
  amount: number
  method: PaymentMethod
  reason: string
  orderId?: string
}

// Every rupee received, in one list. Money paid at the counter while making a sale is stored
// on the order itself, so it is added here next to the payments received later.
export function buildReceipts(orders: Order[], payments: Payment[]): Receipt[] {
  const atSale: Receipt[] = orders
    .map((order) => ({ order, paid: Math.min(order.advance, orderTotal(order)) }))
    .filter(({ paid }) => paid > 0)
    .map(({ order, paid }) => ({
      id: `${order.id}-sale`,
      date: order.createdAt,
      customerId: order.customerId,
      amount: paid,
      method: order.method,
      reason: `Received when buying (${order.invoiceNo})`,
      orderId: order.id
    }))

  const later: Receipt[] = payments.map((payment) => ({
    id: payment.id,
    date: payment.date,
    customerId: payment.customerId,
    amount: payment.amount,
    method: payment.method,
    reason: payment.note ? `Received later: ${payment.note}` : 'Received later'
  }))

  return [...atSale, ...later].sort((a, b) => b.date.localeCompare(a.date))
}

export function receiptMethodLabel(receipt: Receipt): string {
  return paymentMethodLabels[receipt.method]
}
