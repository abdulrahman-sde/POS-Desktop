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
import type { Supplier } from '../types'

type SupplierFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: Supplier // when set, we are editing
  onSaved?: (supplier: Supplier) => void
}

export function SupplierFormDialog({
  open,
  onOpenChange,
  supplier,
  onSaved
}: SupplierFormDialogProps): React.JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {open ? (
          <SupplierForm supplier={supplier} onSaved={onSaved} onDone={() => onOpenChange(false)} />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function SupplierForm({
  supplier,
  onSaved,
  onDone
}: {
  supplier?: Supplier
  onSaved?: (supplier: Supplier) => void
  onDone: () => void
}): React.JSX.Element {
  const { suppliers, addSupplier, updateSupplier } = useData()
  const [name, setName] = useState(supplier?.name ?? '')
  const [phone, setPhone] = useState(supplier?.phone ?? '')
  const [address, setAddress] = useState(supplier?.address ?? '')
  const [notes, setNotes] = useState(supplier?.notes ?? '')
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})

  const submit = (): void => {
    const next: { name?: string; phone?: string } = {}
    const value = name.trim()
    if (!value) next.name = 'Enter the supplier name.'
    else if (
      suppliers.some((s) => s.id !== supplier?.id && s.name.toLowerCase() === value.toLowerCase())
    )
      next.name = 'You already have a supplier with this name.'
    if (phone.trim() && phone.replace(/\D/g, '').length < 10)
      next.phone = 'Phone number looks too short.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const values = {
      name: value,
      phone: phone.trim(),
      address: address.trim(),
      notes: notes.trim()
    }
    if (supplier) {
      updateSupplier(supplier.id, values)
      toast.success('Supplier updated')
      onSaved?.({ ...supplier, ...values })
    } else {
      const created = addSupplier(values)
      toast.success(`${created.name} added`)
      onSaved?.(created)
    }
    onDone()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{supplier ? 'Edit supplier' : 'Add supplier'}</DialogTitle>
        <DialogDescription>
          A supplier is the person or company you buy your stock from.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-3">
        <FormField label="Name" htmlFor="s-name" error={errors.name}>
          <Input id="s-name" autoFocus value={name} onChange={(e) => setName(e.target.value)} />
        </FormField>
        <FormField
          label="Phone / WhatsApp number"
          htmlFor="s-phone"
          error={errors.phone}
          hint="e.g. 0300 1234567"
        >
          <Input id="s-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </FormField>
        <FormField label="Address" htmlFor="s-address">
          <Input id="s-address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </FormField>
        <FormField label="Notes" htmlFor="s-notes">
          <Textarea id="s-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </FormField>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button onClick={submit}>{supplier ? 'Save changes' : 'Add supplier'}</Button>
      </DialogFooter>
    </>
  )
}
