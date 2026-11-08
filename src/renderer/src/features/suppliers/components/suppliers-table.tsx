import { useState } from 'react'
import { Edit, Shop, Trash } from 'reicon-react'
import { toast } from 'sonner'

import { useData } from '@/app/providers/data-context'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/format'
import type { SupplierRow } from '../hooks/use-supplier-rows'
import type { Supplier } from '../types'
import { PaySupplierDialog } from './pay-supplier-dialog'
import { SupplierFormDialog } from './supplier-form-dialog'

export function SuppliersTable({ rows }: { rows: SupplierRow[] }): React.JSX.Element {
  const { deleteSupplier } = useData()
  const [editing, setEditing] = useState<Supplier | undefined>()
  const [deleting, setDeleting] = useState<Supplier | null>(null)
  const [paying, setPaying] = useState<SupplierRow | null>(null)

  return (
    <Card className="gap-0 px-3 py-1">
      {rows.length === 0 ? (
        <EmptyState
          icon={Shop}
          title="No suppliers found"
          description="Add the supplier you buy your stock from."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Total bought</TableHead>
              <TableHead className="text-right">You owe</TableHead>
              <TableHead className="w-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const { supplier, billCount, totalBought, owed } = row
              return (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <p>{supplier.name}</p>
                    {supplier.address ? (
                      <p className="text-xs text-muted-foreground">{supplier.address}</p>
                    ) : null}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {supplier.phone || '-'}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right text-muted-foreground">
                    {formatCurrency(totalBought)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={owed > 0 ? 'text-destructive' : 'text-muted-foreground'}>
                      {owed > 0 ? formatCurrency(owed) : 'Nothing due'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={owed <= 0}
                        onClick={() => setPaying(row)}
                      >
                        Pay
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${supplier.name}`}
                        onClick={() => setEditing(supplier)}
                      >
                        <Edit />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${supplier.name}`}
                        disabled={billCount > 0}
                        title={
                          billCount > 0
                            ? 'You have bills from this supplier, so it cannot be deleted'
                            : 'Delete this supplier'
                        }
                        onClick={() => setDeleting(supplier)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}

      <SupplierFormDialog
        open={editing !== undefined}
        onOpenChange={(open) => !open && setEditing(undefined)}
        supplier={editing}
      />
      <PaySupplierDialog
        supplier={paying?.supplier ?? null}
        owed={paying?.owed ?? 0}
        onOpenChange={(open) => !open && setPaying(null)}
      />

      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleting?.name}?</DialogTitle>
            <DialogDescription>
              You have no bills from this supplier, so nothing else will change.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleting) {
                  deleteSupplier(deleting.id)
                  toast.success(`${deleting.name} deleted`)
                }
                setDeleting(null)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
