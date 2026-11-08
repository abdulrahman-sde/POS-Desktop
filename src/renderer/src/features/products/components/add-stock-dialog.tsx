import { useState } from 'react'
import { toast } from 'sonner'

import { addStockSchema } from '@shared/products/schema'
import { FormField } from '@/components/shared/form-field'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toNumber } from '@/lib/format'
import { useAddStock } from '../hooks/use-product-mutations'
import { PRODUCT_UNIT, type AddStockDialogProps, type AddStockFormProps } from '../types'

export function AddStockDialog({ product, onOpenChange }: AddStockDialogProps): React.JSX.Element {
  return (
    <Dialog open={product !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        {product ? <AddStockForm product={product} onDone={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  )
}

function AddStockForm({ product, onDone }: AddStockFormProps): React.JSX.Element {
  const addStock = useAddStock()
  const [qty, setQty] = useState('')
  const [error, setError] = useState('')

  const submit = async (): Promise<void> => {
    const checked = addStockSchema.safeParse({ id: product.id, qty: toNumber(qty) })
    if (!checked.success) return setError(checked.error.issues[0].message)
    try {
      await addStock.mutateAsync(checked.data)
      toast.success(`Added ${checked.data.qty} ${PRODUCT_UNIT} to ${product.name}`)
      onDone()
    } catch (error) {
      setError((error as Error).message)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add stock</DialogTitle>
        <DialogDescription>
          {product.name}: you have {product.stock} {PRODUCT_UNIT} now.
        </DialogDescription>
      </DialogHeader>
      <FormField label={`How many ${PRODUCT_UNIT} came in?`} htmlFor="stock-qty" error={error}>
        <Input
          id="stock-qty"
          type="number"
          inputMode="numeric"
          min={0}
          autoFocus
          value={qty}
          onChange={(event) => {
            setQty(event.target.value)
            setError('')
          }}
          onKeyDown={(event) => event.key === 'Enter' && submit()}
        />
      </FormField>
      <DialogFooter>
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={addStock.isPending}>
          Add stock
        </Button>
      </DialogFooter>
    </>
  )
}
