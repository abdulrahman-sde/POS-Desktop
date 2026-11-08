import type { Payment } from '@/features/payments/types'
import type { InvoiceSummary, Order, OrderItem } from './types'

export function itemsSubtotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)
}

export function orderTotal(order: Pick<Order, 'items' | 'discount'>): number {
  return Math.max(0, itemsSubtotal(order.items) - order.discount)
}

// How invoice payment status is worked out:
// - The advance is paid when the order is created.
// - Later payments from a customer are applied to their oldest unpaid invoices first.
// - A walk-in customer (no account) always pays in full at the counter.
export function summarizeInvoices(
  orders: Order[],
  payments: Payment[]
): Map<string, InvoiceSummary> {
  const result = new Map<string, InvoiceSummary>()
  const byCustomer = new Map<string, Order[]>()

  for (const order of orders) {
    if (order.customerId === null) {
      const total = orderTotal(order)
      result.set(order.id, { total, paid: total, due: 0, status: 'paid' })
      continue
    }
    byCustomer.set(order.customerId, [...(byCustomer.get(order.customerId) ?? []), order])
  }

  for (const [customerId, customerOrders] of byCustomer) {
    let pool = payments
      .filter((payment) => payment.customerId === customerId)
      .reduce((sum, payment) => sum + payment.amount, 0)

    const oldestFirst = [...customerOrders].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    for (const order of oldestFirst) {
      const total = orderTotal(order)
      const advance = Math.min(order.advance, total)
      const applied = Math.min(total - advance, pool)
      pool -= applied
      const paid = advance + applied
      const due = total - paid
      result.set(order.id, {
        total,
        paid,
        due,
        status: due <= 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid'
      })
    }
  }

  return result
}

// What a customer owes in total. A negative number means they have paid in advance.
export function customerBalance(customerId: string, orders: Order[], payments: Payment[]): number {
  const billed = orders
    .filter((order) => order.customerId === customerId)
    .reduce((sum, order) => sum + orderTotal(order) - Math.min(order.advance, orderTotal(order)), 0)
  const paid = payments
    .filter((payment) => payment.customerId === customerId)
    .reduce((sum, payment) => sum + payment.amount, 0)
  return billed - paid
}
