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
import { Textarea } from '@/components/ui/textarea'
import type { Customer } from '../types'

type CustomerFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: Customer // when set, we are editing
  onSaved?: (customer: Customer) => void
}

export function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
  onSaved
}: CustomerFormDialogProps): React.JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {open ? (
          <CustomerForm customer={customer} onSaved={onSaved} onDone={() => onOpenChange(false)} />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function CustomerForm({
  customer,
  onSaved,
  onDone
}: {
  customer?: Customer
  onSaved?: (customer: Customer) => void
  onDone: () => void
}): React.JSX.Element {
  const { addCustomer, updateCustomer } = useData()
  const [name, setName] = useState(customer?.name ?? '')
  const [phone, setPhone] = useState(customer?.phone ?? '')
  const [address, setAddress] = useState(customer?.address ?? '')
  const [notes, setNotes] = useState(customer?.notes ?? '')
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})

  const submit = (): void => {
    const next: { name?: string; phone?: string } = {}
    if (!name.trim()) next.name = 'Enter the customer name.'
    if (phone.trim() && phone.replace(/\D/g, '').length < 10)
      next.phone = 'Phone number looks too short.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const values = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      notes: notes.trim()
    }
    if (customer) {
      updateCustomer(customer.id, values)
      toast.success('Customer updated')
    } else {
      const created = addCustomer(values)
      toast.success(`${created.name} added`)
      onSaved?.(created)
    }
    onDone()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{customer ? 'Edit customer' : 'Add customer'}</DialogTitle>
        <DialogDescription>
          The phone number is used to send invoices and reminders on WhatsApp.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-3">
        <FormField label="Name" htmlFor="c-name" error={errors.name}>
          <Input id="c-name" autoFocus value={name} onChange={(e) => setName(e.target.value)} />
        </FormField>
        <FormField
          label="Phone / WhatsApp number"
          htmlFor="c-phone"
          error={errors.phone}
          hint="e.g. 0300 1234567"
        >
          <Input id="c-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </FormField>
        <FormField label="Address" htmlFor="c-address">
          <Input id="c-address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </FormField>
        <FormField label="Notes" htmlFor="c-notes">
          <Textarea id="c-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </FormField>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button onClick={submit}>{customer ? 'Save changes' : 'Add customer'}</Button>
      </DialogFooter>
    </>
  )
}
