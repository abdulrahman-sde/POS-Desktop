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
import { useSupplierForm } from '../hooks/use-supplier-form'
import type { SupplierFormDialogProps, SupplierFormProps } from '../types'

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

function SupplierForm(props: SupplierFormProps): React.JSX.Element {
  const { supplier, onDone } = props
  const { form, errors, saving, text, submit } = useSupplierForm(props)

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
          <Input id="s-name" autoFocus value={form.name} onChange={text('name')} />
        </FormField>
        <FormField
          label="Phone / WhatsApp number"
          htmlFor="s-phone"
          error={errors.phone}
          hint="e.g. 0300 1234567"
        >
          <Input id="s-phone" type="tel" value={form.phone} onChange={text('phone')} />
        </FormField>
        <FormField label="Address" htmlFor="s-address" error={errors.address}>
          <Input id="s-address" value={form.address} onChange={text('address')} />
        </FormField>
        <FormField label="Notes" htmlFor="s-notes" error={errors.notes}>
          <Textarea id="s-notes" value={form.notes} onChange={text('notes')} />
        </FormField>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={saving}>
          {supplier ? 'Save changes' : 'Add supplier'}
        </Button>
      </DialogFooter>
    </>
  )
}
