import { useMemo, useState } from 'react'

import { useData } from '@/app/providers/data-context'
import { useCustomers } from '@/features/customers/hooks/use-customers'
import type { Order } from '../types'
import { orderTotal } from '../utils'

export type OrderFilter = 'all' | 'unpaid' | 'paid'

export type OrderRow = {
  order: Order
  customerName: string
  total: number
  paid: number
  due: number
  status: 'paid' | 'partial' | 'unpaid'
}

// Order history rows with search and payment-status filter.
export function useOrderFilters() {
  const { orders, invoices } = useData()
  const { customers } = useCustomers()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<OrderFilter>('all')

  const rows: OrderRow[] = useMemo(
    () =>
      [...orders]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((order) => {
          const summary = invoices.get(order.id)
          return {
            order,
            customerName:
              customers.find((c) => c.id === order.customerId)?.name ?? 'Walk-in customer',
            total: summary?.total ?? orderTotal(order),
            paid: summary?.paid ?? 0,
            due: summary?.due ?? 0,
            status: summary?.status ?? 'paid'
          }
        }),
    [orders, customers, invoices]
  )

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (filter === 'paid' && row.status !== 'paid') return false
      if (filter === 'unpaid' && row.status === 'paid') return false
      return (
        !text ||
        row.order.invoiceNo.toLowerCase().includes(text) ||
        row.customerName.toLowerCase().includes(text)
      )
    })
  }, [rows, query, filter])

  return { query, setQuery, filter, setFilter, rows, filtered }
}
