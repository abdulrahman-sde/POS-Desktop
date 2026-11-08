import { useState } from 'react'
import { toast } from 'sonner'

import { useData } from '@/app/providers/data-context'
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
import { customerBalance } from '@/features/sales/utils'
import { formatCurrency, toNumber } from '@/lib/format'
import { FormField } from './form-field'
import { OptionSelect } from './option-select'

type RecordPaymentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId?: string // when set, the customer is fixed
}

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

function PaymentForm({
  customerId,
  onDone
}: {
  customerId?: string
  onDone: () => void
}): React.JSX.Element {
  const { customers, orders, payments, recordPayment } = useData()
  const [selected, setSelected] = useState(customerId ?? '')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<PaymentMethod>('cash')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const customer = customers.find((item) => item.id === selected)
  const owed = selected ? customerBalance(selected, orders, payments) : 0

  const submit = (): void => {
    const value = toNumber(amount)
    if (!selected) return setError('Choose a customer.')
    if (value <= 0) return setError('Enter an amount greater than zero.')
    recordPayment({ customerId: selected, amount: value, method, note: note.trim() })
    toast.success(`${formatCurrency(value)} received from ${customer?.name ?? 'the customer'}`)
    onDone()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Receive payment</DialogTitle>
        <DialogDescription>
          This lowers the amount the customer owes you. It is counted against their oldest unpaid
          invoices first.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-3">
        {customerId ? null : (
          <FormField label="Customer" htmlFor="pay-customer">
            <OptionSelect
              id="pay-customer"
              value={selected}
              onValueChange={setSelected}
              placeholder="Choose a customer"
              options={customers.map((item) => ({ value: item.id, label: item.name }))}
            />
          </FormField>
        )}

        {selected ? (
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
              min={0}
              autoFocus
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value)
                setError('')
              }}
              onKeyDown={(event) => event.key === 'Enter' && submit()}
              placeholder="0"
            />
            <Button
              variant="outline"
              disabled={owed <= 0}
              onClick={() => setAmount(String(Math.max(0, owed)))}
            >
              Everything they owe
            </Button>
          </div>
        </FormField>

        <FormField label="How did they pay?" htmlFor="pay-method">
          <OptionSelect
            id="pay-method"
            value={method}
            onValueChange={(v) => setMethod(v as PaymentMethod)}
            options={methodOptions}
          />
        </FormField>

        <FormField label="Note (optional)" htmlFor="pay-note">
          <Input id="pay-note" value={note} onChange={(event) => setNote(event.target.value)} />
        </FormField>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button onClick={submit}>Save payment</Button>
      </DialogFooter>
    </>
  )
}
