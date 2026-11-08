import { useMemo } from 'react'

import { useData } from '@/app/providers/data-context'
import { useCustomerRows } from '@/features/customers/hooks/use-customer-rows'
import { getStockLevel } from '@/features/products/types'
import { orderTotal } from '@/features/sales/utils'
import { isSameDay, isSameMonth } from '@/lib/format'

export function useDashboardStats() {
  const { orders, products, customers } = useData()
  const customerRows = useCustomerRows()

  return useMemo(() => {
    const now = new Date()
    const todayOrders = orders.filter((order) => isSameDay(order.createdAt, now))
    const recentOrders = [...orders]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 6)
      .map((order) => ({
        order,
        customerName: customers.find((c) => c.id === order.customerId)?.name ?? 'Walk-in customer',
        total: orderTotal(order)
      }))
    const owing = customerRows
      .filter((row) => row.balance > 0)
      .sort((a, b) => b.balance - a.balance)
    const lowStock = products
      .filter((product) => getStockLevel(product) !== 'ok')
      .sort((a, b) => a.stock - b.stock)

    return {
      todaySales: todayOrders.reduce((sum, order) => sum + orderTotal(order), 0),
      todayCount: todayOrders.length,
      toReceive: owing.reduce((sum, row) => sum + row.balance, 0),
      owingCount: owing.length,
      lowStock,
      monthSales: orders
        .filter((order) => isSameMonth(order.createdAt, now))
        .reduce((sum, order) => sum + orderTotal(order), 0),
      recentOrders,
      topOwing: owing.slice(0, 5)
    }
  }, [orders, products, customers, customerRows])
}
