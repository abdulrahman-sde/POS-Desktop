import { useApiQuery } from '@/lib/use-api'
import { salesApi } from '../api/sales.api'
import { orderKeys } from '../api/sales.keys'
import type { Order, OrdersResult } from '../types'

const NONE: Order[] = []

export function useOrders(): OrdersResult {
  const query = useApiQuery(orderKeys.list(), salesApi.listOrders)
  return { orders: query.data ?? NONE, isLoading: query.isLoading }
}
