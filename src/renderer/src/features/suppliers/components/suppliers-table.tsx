import { useState } from 'react'
import { Edit, Shop, Trash } from 'reicon-react'

import { EmptyState } from '@/components/shared/empty-state'
import { SHOW_DELETE_BUTTONS } from '@/lib/features'
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
import { formatCurrency } from '@/lib/format'
import type { Supplier, SupplierRow } from '../types'
import { PaySupplierDialog } from './pay-supplier-dialog'
import { SupplierDeleteDialog } from './supplier-delete-dialog'
import { SupplierFormDialog } from './supplier-form-dialog'

export function SuppliersTable({ rows }: { rows: SupplierRow[] }): React.JSX.Element {
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
              <TableHead className="text-right">You owe</TableHead>
              <TableHead className="w-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const { supplier, owed } = row
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
                      {SHOW_DELETE_BUTTONS ? (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Delete ${supplier.name}`}
                          disabled={owed > 0}
                          title={
                            owed > 0
                              ? 'You still owe this supplier money. Pay them first.'
                              : 'Delete this supplier'
                          }
                          onClick={() => setDeleting(supplier)}
                        >
                          <Trash />
                        </Button>
                      ) : null}
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

      {deleting ? (
        <SupplierDeleteDialog
          supplier={deleting}
          open
          onOpenChange={(open) => !open && setDeleting(null)}
        />
      ) : null}
    </Card>
  )
}
