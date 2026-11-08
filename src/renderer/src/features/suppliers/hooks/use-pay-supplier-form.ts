import { useState } from 'react'

import { paySupplierSchema } from '@shared/purchases/schema'
import { usePaySupplier } from '@/features/purchases/hooks/use-purchase-mutations'
import type { PaymentMethod } from '@/features/sales/types'
import { toNumber } from '@/lib/format'
import type { PaySupplierFormFields, PaySupplierFormProps } from '../types'

export function usePaySupplierForm({ supplier, onDone }: PaySupplierFormProps) {
  const paySupplier = usePaySupplier()
  const [form, setForm] = useState<PaySupplierFormFields>({ amount: '', method: 'cash' })
  const [error, setError] = useState('')

  const setAmount = (value: string): void => {
    setForm((prev) => ({ ...prev, amount: value }))
    setError('')
  }
  const setMethod = (value: PaymentMethod): void => setForm((prev) => ({ ...prev, method: value }))

  const submit = async (): Promise<void> => {
    const checked = paySupplierSchema.safeParse({
      supplierId: supplier.id,
      amount: toNumber(form.amount),
      method: form.method
    })
    if (!checked.success) return setError(checked.error.issues[0].message)

    try {
      await paySupplier.mutateAsync(checked.data)
      onDone()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return { form, error, saving: paySupplier.isPending, setAmount, setMethod, submit }
}
