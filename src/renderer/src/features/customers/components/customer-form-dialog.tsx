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
import { useCustomerForm } from '../hooks/use-customer-form'
import type { CustomerFormDialogProps, CustomerFormProps } from '../types'

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

function CustomerForm(props: CustomerFormProps): React.JSX.Element {
  const { customer, onDone } = props
  const { form, errors, saving, text, submit } = useCustomerForm(props)

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
          <Input id="c-name" autoFocus value={form.name} onChange={text('name')} />
        </FormField>
        <FormField
          label="Phone / WhatsApp number"
          htmlFor="c-phone"
          error={errors.phone}
          hint="e.g. 0300 1234567"
        >
          <Input id="c-phone" type="tel" value={form.phone} onChange={text('phone')} />
        </FormField>
        <FormField label="Address" htmlFor="c-address" error={errors.address}>
          <Input id="c-address" value={form.address} onChange={text('address')} />
        </FormField>
        <FormField label="Notes" htmlFor="c-notes" error={errors.notes}>
          <Textarea id="c-notes" value={form.notes} onChange={text('notes')} />
        </FormField>
      </div>

      <DialogFooter>
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
