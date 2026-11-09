import { useState } from 'react'

import { recordPaymentSchema } from '@shared/payments/schema'
import { useCustomers } from '@/features/customers/hooks/use-customers'
import type { PaymentMethod } from '@/features/sales/types'
import { useOrders } from '@/features/sales/hooks/use-orders'
import { customerBalance } from '@/features/sales/utils'
import { toNumber } from '@/lib/format'
import type { PaymentFormFields, PaymentFormProps } from '../types'
import { useRecordPayment } from './use-payment-mutations'
import { usePayments } from './use-payments'

export function usePaymentForm({ customerId, onDone }: PaymentFormProps) {
  const recordPayment = useRecordPayment()
  const { orders } = useOrders()
  const { payments } = usePayments()
  const { customers } = useCustomers()
  const [form, setForm] = useState<PaymentFormFields>({
    customerId: customerId ?? '',
    amount: '',
    method: 'cash',
    note: ''
  })
  const [error, setError] = useState('')

  const customer = customers.find((item) => item.id === form.customerId)
  const owed = form.customerId
    ? customerBalance(form.customerId, orders, payments, customer?.openingBalance)
    : 0

  const setCustomer = (value: string): void => setForm((prev) => ({ ...prev, customerId: value }))
  const setMethod = (value: PaymentMethod): void => setForm((prev) => ({ ...prev, method: value }))
  const setNote = (value: string): void => setForm((prev) => ({ ...prev, note: value }))
  const setAmount = (value: string): void => {
    setForm((prev) => ({ ...prev, amount: value }))
    setError('')
  }
  const payEverything = (): void => setAmount(String(Math.max(0, owed)))

  const submit = async (): Promise<void> => {
    const checked = recordPaymentSchema.safeParse({
      customerId: form.customerId,
      amount: toNumber(form.amount),
      method: form.method,
      note: form.note
    })
    if (!checked.success) return setError(checked.error.issues[0].message)

    try {
      await recordPayment.mutateAsync(checked.data)
      onDone()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return {
    form,
    error,
    customer,
    customers,
    owed,
    saving: recordPayment.isPending,
    setCustomer,
    setMethod,
    setNote,
    setAmount,
    payEverything,
    submit
  }
}
