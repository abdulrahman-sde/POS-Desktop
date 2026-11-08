import { useApiQuery } from '@/lib/use-api'
import { paymentsApi } from '../api/payments.api'
import { paymentKeys } from '../api/payments.keys'
import type { Payment, PaymentsResult } from '../types'

const NONE: Payment[] = []

export function usePayments(): PaymentsResult {
  const query = useApiQuery(paymentKeys.list(), paymentsApi.list)
  return { payments: query.data ?? NONE, isLoading: query.isLoading }
}
