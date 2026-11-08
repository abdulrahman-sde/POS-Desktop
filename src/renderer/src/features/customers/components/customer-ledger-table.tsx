import { Receipt } from 'reicon-react'

import { useInvoices } from '@/features/sales/hooks/use-invoices'
import { useInvoiceViewer } from '@/app/providers/invoice-viewer-context'
import { BalanceAmount } from '@/components/shared/balance-amount'
import { EmptyState } from '@/components/shared/empty-state'
import { InvoiceStatusBadge } from '@/components/shared/invoice-status-badge'
import { Badge } from '@/components/ui/badge'
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
import type { LedgerEntry } from '../utils'

export function CustomerLedgerTable({ entries }: { entries: LedgerEntry[] }): React.JSX.Element {
  const invoices = useInvoices()
  const { openInvoice } = useInvoiceViewer()

  return (
    <Card className="gap-0 px-3 py-1">
      {entries.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Nothing here yet"
          description="Invoices and payments will show up here."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Bill</TableHead>
              <TableHead className="text-right">Money received</TableHead>
              <TableHead className="text-right">Total owed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => {
              const status = entry.orderId ? invoices.get(entry.orderId)?.status : undefined
              return (
                <TableRow key={entry.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDate(entry.date)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={entry.kind === 'invoice' ? 'info' : 'success'}>
                      {entry.kind === 'invoice' ? 'Invoice' : 'Payment'}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="flex flex-wrap items-center gap-2">
                        {entry.orderId ? (
                          <Button
                            variant="link"
                            className="h-auto p-0 text-left whitespace-normal text-foreground"
                            onClick={() => openInvoice(entry.orderId!)}
                          >
                            {entry.description}
                          </Button>
                        ) : (
                          entry.description
                        )}
                        {status ? <InvoiceStatusBadge status={status} /> : null}
                      </span>
                      <span className="text-xs text-muted-foreground">{entry.detail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.bill > 0 ? formatCurrency(entry.bill) : ''}
                  </TableCell>
                  <TableCell className="text-right text-success">
                    {entry.received > 0 ? formatCurrency(entry.received) : ''}
                  </TableCell>
                  <TableCell className="text-right">
                    <BalanceAmount amount={entry.totalOwed} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </Card>
  )
}
