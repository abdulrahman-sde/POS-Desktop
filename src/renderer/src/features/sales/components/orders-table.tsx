import { Receipt } from 'reicon-react'

import { useInvoiceViewer } from '@/app/providers/invoice-viewer-context'
import { EmptyState } from '@/components/shared/empty-state'
import { InvoiceStatusBadge } from '@/components/shared/invoice-status-badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/format'
import type { OrderRow } from '../hooks/use-order-filters'

export function OrdersTable({ rows }: { rows: OrderRow[] }): React.JSX.Element {
  const { openInvoice } = useInvoiceViewer()

  return (
    <Card className="gap-0 px-3 py-1">
      {rows.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No orders found"
          description="Try a different search or filter."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="hidden md:table-cell text-right">Money received</TableHead>
              <TableHead className="hidden md:table-cell text-right">Remaining</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ order, customerName, total, paid, due, status }) => (
              <TableRow
                key={order.id}
                className="cursor-pointer"
                onClick={() => openInvoice(order.id)}
              >
                <TableCell>
                  <Button
                    variant="link"
                    className="h-auto p-0"
                    onClick={(event) => {
                      event.stopPropagation()
                      openInvoice(order.id)
                    }}
                  >
                    {order.invoiceNo}
                  </Button>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell>{customerName}</TableCell>
                <TableCell className="text-right">{formatCurrency(total)}</TableCell>
                <TableCell className="hidden md:table-cell text-right text-success">
                  {paid > 0 ? formatCurrency(paid) : '-'}
                </TableCell>
                <TableCell className="hidden md:table-cell text-right text-muted-foreground">
                  {due > 0 ? formatCurrency(due) : '-'}
                </TableCell>
                <TableCell>
                  <InvoiceStatusBadge status={status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  )
}
