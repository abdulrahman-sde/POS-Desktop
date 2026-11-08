import { useMemo } from 'react'

import { usePayments } from '@/features/payments/hooks/use-payments'
import type { InvoiceSummary } from '../types'
import { summarizeInvoices } from '../utils'
import { useOrders } from './use-orders'

export function useInvoices(): Map<string, InvoiceSummary> {
  const { orders } = useOrders()
  const { payments } = usePayments()
  return useMemo(() => summarizeInvoices(orders, payments), [orders, payments])
}
