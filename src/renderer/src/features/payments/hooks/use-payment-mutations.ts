import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useCustomers } from '@/features/customers/hooks/use-customers'
import { formatCurrency } from '@/lib/format'
import { useApiMutation } from '@/lib/use-api'
import { paymentsApi } from '../api/payments.api'
import { paymentKeys } from '../api/payments.keys'

export function useRecordPayment() {
  const queryClient = useQueryClient()
  const { allCustomers } = useCustomers()
  return useApiMutation(paymentsApi.record, {
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all })
      const name = allCustomers.find((c) => c.id === payment.customerId)?.name ?? 'the customer'
      toast.success(`${formatCurrency(payment.amount)} received from ${name}`)
    }
  })
}
