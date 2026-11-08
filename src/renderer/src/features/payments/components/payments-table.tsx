import { Wallet } from 'reicon-react'

import { useInvoiceViewer } from '@/app/providers/invoice-viewer-context'
import { EmptyState } from '@/components/shared/empty-state'
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
import { formatCurrency, formatDateTime } from '@/lib/format'
import { receiptMethodLabel, type Receipt } from '../utils'

type PaymentsTableProps = {
  receipts: Receipt[]
  customerName: (customerId: string | null) => string
}

export function PaymentsTable({ receipts, customerName }: PaymentsTableProps): React.JSX.Element {
  const { openInvoice } = useInvoiceViewer()

  return (
    <Card className="gap-0 px-3 py-1">
      {receipts.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No payments yet"
          description="Money you receive will show up here."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">For</TableHead>
              <TableHead className="hidden md:table-cell">Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDateTime(receipt.date)}
                </TableCell>
                <TableCell>{customerName(receipt.customerId)}</TableCell>
                <TableCell className="hidden sm:table-cell whitespace-normal">
                  {receipt.orderId ? (
                    <Button
                      variant="link"
                      className="h-auto p-0 text-left whitespace-normal text-foreground"
                      onClick={() => openInvoice(receipt.orderId!)}
                    >
                      {receipt.reason}
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">{receipt.reason}</span>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {receiptMethodLabel(receipt)}
                </TableCell>
                <TableCell className="text-right text-success">
                  {formatCurrency(receipt.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  )
}
