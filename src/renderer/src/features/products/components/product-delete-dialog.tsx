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
import { useDeleteProduct } from '../hooks/use-product-mutations'
import { PRODUCT_UNIT, type ProductDeleteDialogProps } from '../types'

export function ProductDeleteDialog({
  product,
  open,
  onOpenChange
}: ProductDeleteDialogProps): React.JSX.Element {
  const deleteProduct = useDeleteProduct()

  const confirm = (): void => {
    deleteProduct.mutate(product, {
      onSuccess: () => onOpenChange(false),
      onError: (error) => toast.error(error.message)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this product?</DialogTitle>
          <DialogDescription>
            {product.stock > 0 ? `You still have ${product.stock} ${PRODUCT_UNIT} in stock. ` : ''}
            You can bring it back from Settings.
          </DialogDescription>
        </DialogHeader>
        <DialogItemName name={product.name} />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirm} disabled={deleteProduct.isPending}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
