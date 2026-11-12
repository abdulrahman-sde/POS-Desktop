import { Trash } from 'reicon-react'

import { FormField } from '@/components/shared/form-field'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCustomerForm } from '../hooks/use-customer-form'
import type { CustomerFormDialogProps, CustomerFormProps } from '../types'

export function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
  onSaved,
  onDelete
}: CustomerFormDialogProps): React.JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {open ? (
          <CustomerForm
            customer={customer}
            onSaved={onSaved}
            onDelete={onDelete}
            onDone={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function CustomerForm(props: CustomerFormProps): React.JSX.Element {
  const { customer, onDone, onDelete } = props
  const { form, errors, saving, text, submit } = useCustomerForm(props)

  return (
    <>
      <DialogHeader>
        <DialogTitle>{customer ? 'Edit customer' : 'Add customer'}</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-3">
        <FormField label="Name" htmlFor="c-name" error={errors.name}>
          <Input id="c-name" autoFocus value={form.name} onChange={text('name')} />
        </FormField>
        <FormField label="Phone / WhatsApp number" htmlFor="c-phone" error={errors.phone}>
          <Input id="c-phone" type="tel" value={form.phone} onChange={text('phone')} />
        </FormField>
        <FormField label="Address" htmlFor="c-address" error={errors.address}>
          <Input id="c-address" value={form.address} onChange={text('address')} />
        </FormField>
        <FormField label="Owes you from before" htmlFor="c-opening" error={errors.openingBalance}>
          <Input
            id="c-opening"
            inputMode="decimal"
            value={form.openingBalance}
            onChange={text('openingBalance')}
          />
        </FormField>
        <FormField label="Notes" htmlFor="c-notes" error={errors.notes}>
          <Textarea id="c-notes" value={form.notes} onChange={text('notes')} />
        </FormField>
      </div>

      <DialogFooter>
        {customer && onDelete ? (
          <Button variant="ghost" className="text-destructive sm:mr-auto" onClick={onDelete}>
            <Trash data-icon="inline-start" />
            Delete customer
          </Button>
        ) : null}
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={saving}>
          {customer ? 'Save changes' : 'Add customer'}
        </Button>
      </DialogFooter>
    </>
  )
}
