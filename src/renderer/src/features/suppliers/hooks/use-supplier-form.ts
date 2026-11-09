import { useState } from 'react'
import { toast } from 'sonner'

import { addSupplierSchema } from '@shared/suppliers/schema'
import { toNumber } from '@/lib/format'
import type { SupplierFormErrors, SupplierFormFields, SupplierFormProps } from '../types'
import { useAddSupplier, useUpdateSupplier } from './use-supplier-mutations'

export function useSupplierForm({ supplier, onSaved, onDone }: SupplierFormProps) {
  const addSupplier = useAddSupplier()
  const updateSupplier = useUpdateSupplier()
  const [form, setForm] = useState<SupplierFormFields>({
    name: supplier?.name ?? '',
    phone: supplier?.phone ?? '',
    address: supplier?.address ?? '',
    notes: supplier?.notes ?? '',
    openingBalance: supplier?.openingBalance ? String(supplier.openingBalance) : ''
  })
  const [errors, setErrors] = useState<SupplierFormErrors>({})
  const saving = addSupplier.isPending || updateSupplier.isPending

  const text =
    (key: keyof SupplierFormFields) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }))
      setErrors((prev) => ({ ...prev, [key]: '' }))
    }

  const submit = async (): Promise<void> => {
    const checked = addSupplierSchema.safeParse({
      ...form,
      openingBalance: toNumber(form.openingBalance)
    })
    if (!checked.success) {
      const next: SupplierFormErrors = {}
      for (const issue of checked.error.issues) next[String(issue.path[0])] ??= issue.message
      setErrors(next)
      return
    }

    try {
      if (supplier) {
        await updateSupplier.mutateAsync({ id: supplier.id, ...checked.data })
      } else {
        const created = await addSupplier.mutateAsync(checked.data)
        onSaved?.(created)
      }
      onDone()
    } catch (error) {
      const message = (error as Error).message
      if (message.includes('name')) setErrors({ name: message })
      else toast.error(message)
    }
  }

  return { form, errors, saving, text, submit }
}
