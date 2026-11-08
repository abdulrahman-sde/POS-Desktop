import { useMemo } from 'react'

import { useData } from '@/app/providers/data-context'
import { customerBalance } from '@/features/sales/utils'
import type { Customer } from '../types'

export type CustomerRow = {
  customer: Customer
  balance: number
  orderCount: number
  lastOrderAt: string | null
}

// Each customer together with what they owe and when they last bought.
export function useCustomerRows(): CustomerRow[] {
  const { customers, orders, payments } = useData()

  return useMemo(
    () =>
      customers.map((customer) => {
        const own = orders.filter((order) => order.customerId === customer.id)
        const last =
          own
            .map((order) => order.createdAt)
            .sort()
            .at(-1) ?? null
        return {
          customer,
          balance: customerBalance(customer.id, orders, payments),
          orderCount: own.length,
          lastOrderAt: last
        }
      }),
    [customers, orders, payments]
  )
}
