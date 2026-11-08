import { useMemo } from 'react'

import { useData } from '@/app/providers/data-context'
import type { InvoiceSummary } from '../types'
import { summarizeInvoices } from '../utils'
import { useOrders } from './use-orders'

export function useInvoices(): Map<string, InvoiceSummary> {
  const { orders } = useOrders()
  const { payments } = useData()
  return useMemo(() => summarizeInvoices(orders, payments), [orders, payments])
}
