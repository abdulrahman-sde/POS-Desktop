import { useState } from 'react'
import { toast } from 'sonner'

import { useData } from '@/app/providers/data-context'
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
import type { Product } from '../types'

type AddStockDialogProps = {
  product: Product | null
  onOpenChange: (open: boolean) => void
}

export function AddStockDialog({ product, onOpenChange }: AddStockDialogProps): React.JSX.Element {
  return (
    <Dialog open={product !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        {product ? <AddStockForm product={product} onDone={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  )
}

function AddStockForm({
  product,
  onDone
}: {
  product: Product
  onDone: () => void
}): React.JSX.Element {
  const { addStock } = useData()
  const [qty, setQty] = useState('')
  const [error, setError] = useState('')

  const submit = (): void => {
    const value = toNumber(qty)
    if (value <= 0) return setError('Enter how many units arrived.')
    addStock(product.id, value)
    toast.success(`Added ${value} ${product.unit} to ${product.name}`)
    onDone()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add stock</DialogTitle>
        <DialogDescription>
          {product.name}: you have {product.stock} {product.unit} now.
        </DialogDescription>
      </DialogHeader>
      <FormField label={`How many ${product.unit} came in?`} htmlFor="stock-qty" error={error}>
        <Input
          id="stock-qty"
          type="number"
          inputMode="decimal"
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
        <Button onClick={submit}>Add stock</Button>
      </DialogFooter>
    </>
  )
}
