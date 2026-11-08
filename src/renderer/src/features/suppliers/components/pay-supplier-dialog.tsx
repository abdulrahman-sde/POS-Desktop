import { DialogItemName } from '@/components/shared/dialog-item-name'
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
import { formatCurrency } from '@/lib/format'
import { usePaySupplierForm } from '../hooks/use-pay-supplier-form'
import type { PaySupplierDialogProps, PaySupplierFormProps } from '../types'

const methodOptions = (Object.keys(paymentMethodLabels) as PaymentMethod[]).map((value) => ({
  value,
  label: paymentMethodLabels[value]
}))

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

function PayForm(props: PaySupplierFormProps): React.JSX.Element {
  const { supplier, owed, onDone } = props
  const { form, error, saving, setAmount, setMethod, submit } = usePaySupplierForm(props)

  return (
    <>
      <DialogHeader>
        <DialogTitle>Pay this supplier</DialogTitle>
        <DialogDescription>
          {owed > 0
            ? `You owe them ${formatCurrency(owed)}. This lowers it.`
            : 'You do not owe them anything right now.'}
        </DialogDescription>
      </DialogHeader>
      <DialogItemName name={supplier.name} />
      <FormField label="Money paid (Rs)" htmlFor="sp-amount" error={error}>
        <Input
          id="sp-amount"
          autoFocus
          type="number"
          inputMode="decimal"
          step="any"
          min={0}
          value={form.amount}
          onChange={(event) => setAmount(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && submit()}
        />
      </FormField>
      <FormField label="How did you pay?" htmlFor="sp-method">
        <OptionSelect
          id="sp-method"
          value={form.method}
          onValueChange={(v) => setMethod(v as PaymentMethod)}
          options={methodOptions}
        />
      </FormField>
      <DialogFooter>
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={saving}>
          Save payment
        </Button>
      </DialogFooter>
    </>
  )
}
