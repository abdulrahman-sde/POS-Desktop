import type { Customer } from '@/features/customers/types'
import { PRODUCT_UNIT } from '@/features/products/types'
import { paymentMethodLabels, type InvoiceSummary, type Order } from '@/features/sales/types'
import { itemsSubtotal } from '@/features/sales/utils'
import type { ShopSettings } from '@/features/settings/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/format'

type InvoiceDocumentProps = {
  order: Order
  summary: InvoiceSummary
  customer: Customer | undefined
  settings: ShopSettings
}

// The invoice itself. It is shown on the page and printed from the same component.
export function InvoiceDocument({
  order,
  summary,
  customer,
  settings
}: InvoiceDocumentProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-6 text-sm text-foreground">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <p className="text-xl">{settings.shopName}</p>
          <p className="text-muted-foreground">{settings.address}</p>
          <p className="text-muted-foreground">{settings.phone}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-xl">Invoice</p>
          <p>{order.invoiceNo}</p>
          <p className="text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground">Bill to</p>
        <p>{customer?.name ?? 'Walk-in customer'}</p>
        {customer?.phone ? <p className="text-muted-foreground">{customer.phone}</p> : null}
        {customer?.address ? <p className="text-muted-foreground">{customer.address}</p> : null}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.items.map((item) => (
            <TableRow key={item.productId}>
              <TableCell className="whitespace-normal">{item.name}</TableCell>
              <TableCell className="text-right">
                {item.qty} {PRODUCT_UNIT}
              </TableCell>
              <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.qty * item.unitPrice)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="ml-auto flex w-full flex-col gap-1 sm:w-72">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatCurrency(itemsSubtotal(order.items))}</span>
        </div>
        {order.discount > 0 ? (
          <div className="flex justify-between text-muted-foreground">
            <span>Discount</span>
            <span>-{formatCurrency(order.discount)}</span>
          </div>
        ) : null}
        <div className="flex justify-between border-t pt-1 text-base">
          <span>Total</span>
          <span>{formatCurrency(summary.total)}</span>
        </div>
        <div className="flex justify-between">
          <span>
            Money received
            {order.advance > 0 ? ` (${paymentMethodLabels[order.method].toLowerCase()})` : ''}
          </span>
          <span>{formatCurrency(summary.paid)}</span>
        </div>
        <div className="flex justify-between text-base">
          <span>Remaining to pay</span>
          <span>{formatCurrency(summary.due)}</span>
        </div>
      </div>

      <p className="border-t pt-3 text-center text-xs text-muted-foreground">
        {settings.invoiceNote}
      </p>
    </div>
  )
}
