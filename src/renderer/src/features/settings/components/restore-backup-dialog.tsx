import { DialogItemName } from '@/components/shared/dialog-item-name'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { formatDate, plural } from '@/lib/format'
import { useRestoreBackup } from '../hooks/use-restore-backup'
import type { RestoreBackupDialogProps } from '../types'

export function RestoreBackupDialog({
  summary,
  onOpenChange
}: RestoreBackupDialogProps): React.JSX.Element {
  const restore = useRestoreBackup()

  return (
    <Dialog
      open={summary !== null}
      onOpenChange={(open) => !restore.isPending && onOpenChange(open)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bring back this copy?</DialogTitle>
          <DialogDescription>
            This replaces everything in the app now. You will sign in again.
          </DialogDescription>
        </DialogHeader>
        {summary ? (
          <>
            <DialogItemName name={summary.fileName} />
            <p className="text-sm text-muted-foreground">
              Saved {formatDate(summary.savedAt)}: {plural(summary.customers, 'customer')},{' '}
              {plural(summary.products, 'product')}, {plural(summary.invoices, 'invoice')}
            </p>
          </>
        ) : null}
        <DialogFooter>
          <Button
            variant="outline"
            disabled={restore.isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={restore.isPending}
            onClick={() => restore.mutate()}
          >
            Bring back
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
