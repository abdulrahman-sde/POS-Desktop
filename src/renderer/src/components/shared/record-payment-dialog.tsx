import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { usePaymentForm } from '@/features/payments/hooks/use-payment-form'
import type { PaymentFormProps, RecordPaymentDialogProps } from '@/features/payments/types'
import { paymentMethodLabels, type PaymentMethod } from '@/features/sales/types'
import { formatCurrency } from '@/lib/format'
import { FormField } from './form-field'
import { OptionSelect } from './option-select'

const methodOptions = (Object.keys(paymentMethodLabels) as PaymentMethod[]).map((value) => ({
  value,
  label: paymentMethodLabels[value]
}))

export function RecordPaymentDialog({
  open,
  onOpenChange,
  customerId
}: RecordPaymentDialogProps): React.JSX.Element {
  // The form is mounted only while open, so it starts fresh every time.
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {open ? <PaymentForm customerId={customerId} onDone={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  )
}

function PaymentForm(props: PaymentFormProps): React.JSX.Element {
  const { customerId, onDone } = props
  const {
    form,
    error,
    customer,
    customers,
    owed,
    saving,
    setCustomer,
    setMethod,
    setNote,
    setAmount,
    payEverything,
    submit
  } = usePaymentForm(props)

  return (
    <>
      <DialogHeader>
        <DialogTitle>Receive payment</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-3">
        {customerId ? null : (
          <FormField label="Customer" htmlFor="pay-customer">
            <OptionSelect
              id="pay-customer"
              value={form.customerId}
              onValueChange={setCustomer}
              placeholder="Choose a customer"
              options={customers.map((item) => ({ value: item.id, label: item.name }))}
            />
          </FormField>
        )}

        {form.customerId ? (
          <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
            <span className="text-muted-foreground">{customer?.name} owes you</span>
            <span>{formatCurrency(owed)}</span>
          </div>
        ) : null}

        <FormField label="Amount received" htmlFor="pay-amount" error={error}>
          <div className="flex gap-2">
            <Input
              id="pay-amount"
              type="number"
              inputMode="decimal"
              step="any"
              min={0}
              autoFocus
              value={form.amount}
              onChange={(event) => setAmount(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && submit()}
              placeholder="0"
            />
            <Button variant="outline" disabled={owed <= 0} onClick={payEverything}>
              Everything they owe
            </Button>
          </div>
        </FormField>

        <FormField label="How did they pay?" htmlFor="pay-method">
          <OptionSelect
            id="pay-method"
            value={form.method}
            onValueChange={(v) => setMethod(v as PaymentMethod)}
            options={methodOptions}
          />
        </FormField>

        <FormField label="Note (optional)" htmlFor="pay-note">
          <Input
            id="pay-note"
            value={form.note}
            onChange={(event) => setNote(event.target.value)}
          />
        </FormField>
      </div>

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
