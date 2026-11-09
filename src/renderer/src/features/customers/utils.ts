import type { Payment } from '@/features/payments/types'
import { paymentMethodLabels, type Order } from '@/features/sales/types'
import { orderTotal, summarizeInvoices } from '@/features/sales/utils'
import type { ShopSettings } from '@/features/settings/types'
import { formatCurrency } from '@/lib/format'
import type { Customer } from './types'

export type LedgerEntry = {
  id: string
  date: string
  kind: 'invoice' | 'payment' | 'opening'
  description: string
  detail: string
  orderId?: string
  bill: number // the invoice total (invoices only)
  received: number // money received when buying (invoices) or later (payments)
  totalOwed: number // everything he owed you after this line
}

// One line per invoice (with the money received when buying on the same line) and one line per
// payment received later. "totalOwed" is his whole account after that line: it goes up by the bill,
// down by the money received. The newest line therefore equals what he owes you today.
export function buildLedger(
  customerId: string,
  orders: Order[],
  payments: Payment[],
  openingBalance = 0
): LedgerEntry[] {
  const summaries = summarizeInvoices(orders, payments)

  const invoices: Omit<LedgerEntry, 'totalOwed'>[] = orders
    .filter((order) => order.customerId === customerId)
    .map((order) => {
      const total = orderTotal(order)
      const atSale = Math.min(order.advance, total)
      const summary = summaries.get(order.id)
      const clearedLater = summary ? Math.max(0, summary.paid - atSale) : 0
      return {
        id: order.id,
        date: order.createdAt,
        kind: 'invoice',
        description: `Invoice ${order.invoiceNo}`,
        detail: [
          atSale > 0
            ? `Received when buying: ${paymentMethodLabels[order.method]}`
            : 'Nothing received when buying',
          clearedLater > 0 ? `${formatCurrency(clearedLater)} cleared by later payments` : ''
        ]
          .filter(Boolean)
          .join(' · '),
        orderId: order.id,
        bill: total,
        received: atSale
      }
    })

  const received: Omit<LedgerEntry, 'totalOwed'>[] = payments
    .filter((payment) => payment.customerId === customerId)
    .map((payment) => ({
      id: payment.id,
      date: payment.date,
      kind: 'payment',
      description: 'Payment received',
      detail: [paymentMethodLabels[payment.method], payment.note].filter(Boolean).join(' · '),
      bill: 0,
      received: payment.amount
    }))

  const before: Omit<LedgerEntry, 'totalOwed'>[] =
    openingBalance > 0
      ? [
          {
            id: 'opening',
            date: '',
            kind: 'opening',
            description: 'Owed from before',
            detail: 'What this customer already owed you before you started using Stockwise',
            bill: openingBalance,
            received: 0
          }
        ]
      : []

  const oldestFirst = [...before, ...invoices, ...received].sort(
    (a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)
  )
  let owed = 0
  return oldestFirst
    .map((row) => {
      owed += row.bill - row.received
      return { ...row, totalOwed: owed }
    })
    .reverse() // newest first
}

export function buildReminderMessage(
  customer: Customer,
  balance: number,
  settings: ShopSettings
): string {
  return [
    `Assalam o Alaikum ${customer.name},`,
    '',
    `This is a friendly reminder from ${settings.shopName}.`,
    `The amount you still owe us is ${formatCurrency(balance)}.`,
    '',
    'Kindly arrange the payment at your earliest convenience. Thank you!'
  ].join('\n')
}
