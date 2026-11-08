import type { Customer } from '@/features/customers/types'
import type { InvoiceSummary, Order } from '@/features/sales/types'
import type { ShopSettings } from '@/features/settings/types'
import { formatCurrency, formatDate } from '@/lib/format'

// The message that WhatsApp opens with, ready to send.
export function buildInvoiceMessage(
  order: Order,
  summary: InvoiceSummary,
  customer: Customer | undefined,
  totalBalance: number,
  settings: ShopSettings
): string {
  const lines = order.items.map(
    (item) => `- ${item.name} x ${item.qty} = ${formatCurrency(item.qty * item.unitPrice)}`
  )
  return [
    `Assalam o Alaikum ${customer?.name ?? ''},`.replace(' ,', ','),
    '',
    `Thank you for shopping with ${settings.shopName}.`,
    '',
    `Invoice: ${order.invoiceNo}`,
    `Date: ${formatDate(order.createdAt)}`,
    '',
    ...lines,
    '',
    `Total: ${formatCurrency(summary.total)}`,
    `Money received: ${formatCurrency(summary.paid)}`,
    `Remaining on this invoice: ${formatCurrency(summary.due)}`,
    ...(totalBalance > 0 ? [`Total amount you still owe us: ${formatCurrency(totalBalance)}`] : []),
    '',
    `${settings.shopName} - ${settings.phone}`
  ].join('\n')
}
