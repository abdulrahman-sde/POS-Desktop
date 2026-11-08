import type { Payment } from '@shared/payments/types'
import type { PaymentMethod } from '@/features/sales/types'

export type { Payment }

export type PaymentsResult = {
  payments: Payment[]
  isLoading: boolean
}

export type PaymentFormFields = {
  customerId: string
  amount: string
  method: PaymentMethod
  note: string
}

export type RecordPaymentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId?: string
}

export type PaymentFormProps = {
  customerId?: string
  onDone: () => void
}
