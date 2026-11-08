import { toast } from 'sonner'

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
import { useDeleteSupplier } from '../hooks/use-supplier-mutations'
import type { SupplierDeleteDialogProps } from '../types'

export function SupplierDeleteDialog({
  supplier,
  open,
  onOpenChange
}: SupplierDeleteDialogProps): React.JSX.Element {
  const deleteSupplier = useDeleteSupplier()

  const confirm = (): void => {
    deleteSupplier.mutate(supplier, {
      onSuccess: () => {
        onOpenChange(false)
      },
      onError: (error) => toast.error(error.message)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this supplier?</DialogTitle>
          <DialogDescription>
            They will no longer show in your suppliers list. Your old bills and payments stay in
            your records.
          </DialogDescription>
        </DialogHeader>
        <DialogItemName name={supplier.name} />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirm} disabled={deleteSupplier.isPending}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
