import { useMemo } from 'react'

import { useData } from '@/app/providers/data-context'
import { orderTotal } from '@/features/sales/utils'
import { isSameDay } from '@/lib/format'

export type ReportRange = 7 | 30

export function useReport(range: ReportRange) {
  const { orders } = useData()

  return useMemo(() => {
    const start = new Date()
    start.setDate(start.getDate() - (range - 1))
    start.setHours(0, 0, 0, 0)

    const inRange = orders.filter((order) => new Date(order.createdAt) >= start)
    const sales = inRange.reduce((sum, order) => sum + orderTotal(order), 0)
    const cost = inRange.reduce(
      (sum, order) =>
        sum + order.items.reduce((inner, item) => inner + item.qty * item.costPrice, 0),
      0
    )

    const days = Array.from({ length: range }, (_, index) => {
      const day = new Date(start)
      day.setDate(start.getDate() + index)
      const ofDay = inRange.filter((order) => isSameDay(order.createdAt, day))
      return {
        date: day,
        total: ofDay.reduce((sum, order) => sum + orderTotal(order), 0),
        orders: ofDay.length
      }
    })

    const byProduct = new Map<
      string,
      { name: string; qty: number; revenue: number; unit: string }
    >()
    for (const order of inRange) {
      for (const item of order.items) {
        const current = byProduct.get(item.productId) ?? {
          name: item.name,
          qty: 0,
          revenue: 0,
          unit: item.unit
        }
        current.qty += item.qty
        current.revenue += item.qty * item.unitPrice
        byProduct.set(item.productId, current)
      }
    }
    const topProducts = [...byProduct.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 6)

    return { sales, profit: sales - cost, orderCount: inRange.length, days, topProducts }
  }, [orders, range])
}
