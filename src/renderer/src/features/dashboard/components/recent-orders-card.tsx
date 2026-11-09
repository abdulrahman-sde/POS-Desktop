import { Link } from 'react-router'

import { InvoiceStatusBadge } from '@/components/shared/invoice-status-badge'
import { useInvoices } from '@/features/sales/hooks/use-invoices'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useInvoiceViewer } from '@/app/providers/invoice-viewer-context'
import { formatCurrency, formatDate } from '@/lib/format'
import type { Order } from '@/features/sales/types'

type Row = { order: Order; customerName: string; total: number }

export function RecentOrdersCard({ rows }: { rows: Row[] }): React.JSX.Element {
  const invoices = useInvoices()
  const { openInvoice } = useInvoiceViewer()

  return (
    <Card>
      <CardHeader className="border-b border-foreground/10">
        <CardTitle>Recent orders</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link to="/orders" />}>
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-foreground/10 px-2">
        {rows.map(({ order, customerName, total }) => (
          <Button
            key={order.id}
            variant="ghost"
            className="h-auto w-full justify-between gap-3 rounded-lg bg-transparent px-2 py-2 font-normal hover:bg-muted"
            onClick={() => openInvoice(order.id)}
          >
            <span className="flex min-w-0 flex-col items-start">
              <span className="break-words text-left">{customerName}</span>
              <span className="text-xs text-muted-foreground">
                {order.invoiceNo} · {formatDate(order.createdAt)}
              </span>
            </span>
            <span className="flex items-center gap-3">
              <InvoiceStatusBadge status={invoices.get(order.id)?.status ?? 'paid'} />
              <span>{formatCurrency(total)}</span>
            </span>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
