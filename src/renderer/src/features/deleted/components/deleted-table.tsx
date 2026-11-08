import { Trash } from 'reicon-react'
import { toast } from 'sonner'

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
import { formatDate } from '@/lib/format'
import { useRestoreRecord } from '../hooks/use-restore-record'
import type { DeletedTableProps } from '../types'

export function DeletedTable({ records, kind, empty }: DeletedTableProps): React.JSX.Element {
  const restore = useRestoreRecord()

  return (
    <Card className="gap-0 px-3 py-1">
      {records.length === 0 ? (
        <EmptyState icon={Trash} title={empty} description="Things you delete will show up here." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Deleted on</TableHead>
              <TableHead className="w-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <p>{record.name}</p>
                  {record.detail ? (
                    <p className="text-xs text-muted-foreground">{record.detail}</p>
                  ) : null}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-right text-muted-foreground">
                  {formatDate(record.deletedAt)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={restore.isPending}
                      onClick={() =>
                        restore.mutate(
                          { kind, id: record.id, name: record.name },
                          { onError: (error) => toast.error(error.message) }
                        )
                      }
                    >
                      Bring back
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  )
}
