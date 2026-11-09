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
import { useDeleteCustomer } from '../hooks/use-customer-mutations'
import type { CustomerDeleteDialogProps } from '../types'

export function CustomerDeleteDialog({
  customer,
  open,
  onOpenChange,
  onDeleted
}: CustomerDeleteDialogProps): React.JSX.Element {
  const deleteCustomer = useDeleteCustomer()

  const confirm = (): void => {
    deleteCustomer.mutate(customer, {
      onSuccess: () => {
        onOpenChange(false)
        onDeleted()
      },
      onError: (error) => toast.error(error.message)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this customer?</DialogTitle>
          <DialogDescription>
            Their old invoices and payments stay in your records.
          </DialogDescription>
        </DialogHeader>
        <DialogItemName name={customer.name} />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirm} disabled={deleteCustomer.isPending}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
