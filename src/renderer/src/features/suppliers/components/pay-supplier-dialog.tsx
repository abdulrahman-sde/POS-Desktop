import { useState } from 'react'
import { toast } from 'sonner'

import { useData } from '@/app/providers/data-context'
import { FormField } from '@/components/shared/form-field'
import { OptionSelect } from '@/components/shared/option-select'
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
import { paymentMethodLabels, type PaymentMethod } from '@/features/sales/types'
import { formatCurrency, toNumber } from '@/lib/format'
import type { Supplier } from '../types'

const methodOptions = (Object.keys(paymentMethodLabels) as PaymentMethod[]).map((value) => ({
  value,
  label: paymentMethodLabels[value]
}))

type PaySupplierDialogProps = {
  supplier: Supplier | null // the dialog is open while this is set
  owed: number
  onOpenChange: (open: boolean) => void
}

export function PaySupplierDialog({
  supplier,
  owed,
  onOpenChange
}: PaySupplierDialogProps): React.JSX.Element {
  return (
    <Dialog open={supplier !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        {supplier ? (
          <PayForm supplier={supplier} owed={owed} onDone={() => onOpenChange(false)} />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function PayForm({
  supplier,
  owed,
  onDone
}: {
  supplier: Supplier
  owed: number
  onDone: () => void
}): React.JSX.Element {
  const { paySupplier } = useData()
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<PaymentMethod>('cash')
  const [error, setError] = useState('')

  const submit = (): void => {
    const value = toNumber(amount)
    if (value <= 0) return setError('Enter how much you paid.')
    paySupplier({ supplierId: supplier.id, amount: value, method, note: '' })
    toast.success(`${formatCurrency(value)} paid to ${supplier.name}`)
    onDone()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Pay {supplier.name}</DialogTitle>
        <DialogDescription>
          {owed > 0
            ? `You owe them ${formatCurrency(owed)}. This lowers it.`
            : 'You do not owe them anything right now.'}
        </DialogDescription>
      </DialogHeader>
      <FormField label="Money paid (Rs)" htmlFor="sp-amount" error={error}>
        <Input
          id="sp-amount"
          autoFocus
          type="number"
          inputMode="decimal"
          min={0}
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value)
            setError('')
          }}
          onKeyDown={(event) => event.key === 'Enter' && submit()}
        />
      </FormField>
      <FormField label="How did you pay?" htmlFor="sp-method">
        <OptionSelect
          id="sp-method"
          value={method}
          onValueChange={(v) => setMethod(v as PaymentMethod)}
          options={methodOptions}
        />
      </FormField>
      <DialogFooter>
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button onClick={submit}>Save payment</Button>
      </DialogFooter>
    </>
  )
}
