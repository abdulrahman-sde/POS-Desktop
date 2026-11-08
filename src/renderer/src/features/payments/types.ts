import type { PaymentMethod } from '@/features/sales/types'

// A payment a customer makes later, to reduce what they owe.
export type Payment = {
  id: string
  customerId: string
  amount: number
  method: PaymentMethod
  note: string
  date: string
}
