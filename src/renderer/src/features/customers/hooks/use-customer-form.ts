import { useState } from 'react'
import { toast } from 'sonner'

import { addCustomerSchema } from '@shared/customers/schema'
import type { CustomerFormErrors, CustomerFormFields, CustomerFormProps } from '../types'
import { useAddCustomer, useUpdateCustomer } from './use-customer-mutations'

export function useCustomerForm({ customer, onSaved, onDone }: CustomerFormProps) {
  const addCustomer = useAddCustomer()
  const updateCustomer = useUpdateCustomer()
  const [form, setForm] = useState<CustomerFormFields>({
    name: customer?.name ?? '',
    phone: customer?.phone ?? '',
    address: customer?.address ?? '',
    notes: customer?.notes ?? ''
  })
  const [errors, setErrors] = useState<CustomerFormErrors>({})
  const saving = addCustomer.isPending || updateCustomer.isPending

  const text =
    (key: keyof CustomerFormFields) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }))
      setErrors((prev) => ({ ...prev, [key]: '' }))
    }

  const submit = async (): Promise<void> => {
    const checked = addCustomerSchema.safeParse(form)
    if (!checked.success) {
      const next: CustomerFormErrors = {}
      for (const issue of checked.error.issues) next[String(issue.path[0])] ??= issue.message
      setErrors(next)
      return
    }

    try {
      if (customer) {
        await updateCustomer.mutateAsync({ id: customer.id, ...checked.data })
      } else {
        const created = await addCustomer.mutateAsync(checked.data)
        onSaved?.(created)
      }
      onDone()
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return { form, errors, saving, text, submit }
}
