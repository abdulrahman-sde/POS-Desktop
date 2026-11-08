import { useApiQuery } from '@/lib/use-api'
import { purchasesApi } from '../api/purchases.api'
import { purchaseKeys } from '../api/purchases.keys'
import type { Purchase, PurchasesResult } from '../types'

const NONE: Purchase[] = []

export function usePurchases(): PurchasesResult {
  const query = useApiQuery(purchaseKeys.list(), purchasesApi.list)
  return { purchases: query.data ?? NONE, isLoading: query.isLoading }
}
