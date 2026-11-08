import { useApiQuery } from '@/lib/use-api'
import { purchasesApi } from '../api/purchases.api'
import { supplierPaymentKeys } from '../api/purchases.keys'
import type { SupplierPayment, SupplierPaymentsResult } from '../types'

const NONE: SupplierPayment[] = []

export function useSupplierPayments(): SupplierPaymentsResult {
  const query = useApiQuery(supplierPaymentKeys.list(), purchasesApi.listSupplierPayments)
  return { supplierPayments: query.data ?? NONE, isLoading: query.isLoading }
}
