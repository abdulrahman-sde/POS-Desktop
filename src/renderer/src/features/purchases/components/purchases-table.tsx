import { Receipt2 } from 'reicon-react'

import { useData } from '@/app/providers/data-context'
import { useSuppliers } from '@/features/suppliers/hooks/use-suppliers'
import { EmptyState } from '@/components/shared/empty-state'
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
import { purchaseSubtotal } from '../utils'

// Every bill received from a supplier, newest first.
export function PurchasesTable(): React.JSX.Element {
  const { purchases } = useData()
  const { allSuppliers: suppliers } = useSuppliers()
  const bills = [...purchases].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <Card className="gap-0 px-3 py-1">
      {bills.length === 0 ? (
        <EmptyState
          icon={Receipt2}
          title="No stock bills yet"
          description="Use Buy stock to add your first bill."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill</TableHead>
              <TableHead className="hidden sm:table-cell">Supplier</TableHead>
              <TableHead className="hidden md:table-cell">What you bought</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Still to pay</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map((bill) => {
              const total = purchaseSubtotal(bill.items)
              const due = total - bill.paid
              return (
                <TableRow key={bill.id}>
                  <TableCell>
                    <p>{bill.billNo}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(bill.createdAt)}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {suppliers.find((s) => s.id === bill.supplierId)?.name ?? 'Deleted supplier'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {bill.items.map((item) => `${item.qty} x ${item.name}`).join(', ')}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(total)}</TableCell>
                  <TableCell className="text-right">
                    <span className={due > 0 ? 'text-destructive' : 'text-muted-foreground'}>
                      {due > 0 ? formatCurrency(due) : 'Paid'}
                    </span>
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
